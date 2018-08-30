/**
 * @file gulp task
 * @author yufeng04
 */
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const zip = require('gulp-jszip');
const minimist = require('minimist');
const inquirer = require('inquirer');
// 命令行参数获取
let argv = minimist(process.argv.slice(2));
// meta.json 文件读取
let metaPath = path.resolve(process.cwd(), 'meta.json');
let metaData = JSON.parse(readFile(metaPath));

/**
 * 用于判断目录是否存在
 * @param {string} path 文件目录
 * @return {boolean} 判断结果
 */
function isExist(path) {
    return fs.existsSync(path);
}

/**
 * 读取文件
 * @param {string} p 文件路径
 * @return {string} 读取的数据
 */
function readFile(p) {
    let rst = '';
    p = (typeof (p) === 'object') ? path.join(p.dir, p.base) : p;
    return rst = fs.readFileSync(p, 'utf-8');
}

/**
 * 向文件中写入数据
 * @param {string} p 文件路径
 * @param {Object} data 写入文件的数据
 */
function writeFile(p, data) {
    let macliPath = path.join(process.cwd(), 'src/' + argv.name + '/.ma-cli');
    if (!isExist(macliPath)) {
        fs.mkdirSync(macliPath);
    }
    fs.writeFileSync(p, data)
}

/**
 * 获取模板pages components app.json 相对于模板文件的路径
 */
function getConf () {
    return inquirer.prompt([{
        type: 'confirm',
        message: 'Is it official template?',
        default: true,
        name: 'own'
    },{
        type: 'default',
        message: 'template description',
        default: argv.name + '模板',
        name: 'desc'
    },{
        type: 'default',
        message: 'pages folder path',
        default: 'pages',
        name: 'pagesPath'
    },{
        type: 'default',
        message: 'components folder path',
        default: 'components',
        name: 'compoPath'
    },{
        type: 'default',
        message: 'app.json file path',
        default: 'app.json',
        name: 'appJsonPath'
    }])
}

/**
 * 组册模板名是否重复
 * @param {string} name 模板名
 * @param {Object}} meta meta.json数据
 */
function checkName (name, meta) {
    return new Promise((resolve, reject) => {
        if (!name || !meta) {
            reject();
        }
        let list = meta.official.concat(meta.github);
        for (let i = 0; i < list.length; i++) {
            if (list[i].name === name) {
                reject();
            }
        }
        resolve();
    })
}

/**
 * 配置模板json文件
 */
gulp.task('config', function (done) {
    // 命令行模板名
    if (!argv.name) {
        console.error('template name needed!')
        console.info('Please try `gulp config --name tplName`');
        return done();
    }
    // src中是否存在模板文件
    let tplPath = path.join(process.cwd(), 'src/' + argv.name);
    if (!isExist(tplPath)) {
        console.log('template file do not exist');
        return done();
    }
    // 模板名检查
    checkName(argv.name, metaData).then(() => {
        // 模板文件添加配置项
        getConf().then(answer => {
            let tplData = {
                "name": argv.name,
                "pagesPath": answer.pagesPath,
                "compoPath": answer.compoPath,
                "appJsonPath": answer.appJsonPath
            };
            let confFilePath = path.join(process.cwd(), 'src/' + argv.name + '/.ma-cli/template.config.json');
            writeFile(confFilePath, JSON.stringify(tplData, null, 4));

            let descData = {
                "name": argv.name,
                "description": answer.desc
            };
            answer.own ? metaData.official.push(descData) : metaData.github.push(descData);
            writeFile(metaPath, JSON.stringify(metaData, null, 4));
            // 将template压缩
            gulp.src('./src/' + argv.name)
                .pipe(zip({
                    name: argv.name + '.zip',
                    outpath: './zips'
                }));
            });
    }).catch(() => {
        console.log('tmmplate name is existed.')
        done();
    });
});
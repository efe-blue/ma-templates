/**
 * @file build
 * @author xxx
 */


const gulp = require('gulp');
const less = require('gulp-less');
const filter = require('gulp-filter');
const fileinclude = require('gulp-file-include');
const plumber = require('gulp-plumber');
const del = require('del');
let argv = require('yargs').argv;
const removeCode = require('gulp-remove-code');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');
const path = require('path');
let development = (argv.development === undefined) ? false : true;
let production = (argv.production === undefined) ? false : true;
let test = (argv.test === undefined) ? false : true;

if (!production && !test) {
    development = true;
}

let bootstrap;
gulp.task('bootstrap', function () {
    bootstrap = gulp.src(__dirname + '/bootstrap/**')
        .pipe(filter(['**', '!bootstrap/app.less']))
        .pipe(removeCode({test, development, production}))
        .pipe(gulp.dest('output'));
    return bootstrap;
});

let images;
gulp.task('images', function () {
    images = gulp.src(__dirname + '/images/**/*', {base: '.'})
        .pipe(gulp.dest('output'));
    return images;
});

let include;
gulp.task('include', function () {
    include = gulp.src(__dirname + '/include/**', {base: '.'})
        .pipe(filter(['include/**/*.js']))
        .pipe(gulp.dest('output'));
    return include;
});

let pages;
gulp.task('pages', function () {
    pages = gulp.src(__dirname + '/pages/**/*', {base: '.'})
        .pipe(filter(['**', '!pages/**/*.less']))
        .pipe(fileinclude())
        .pipe(removeCode({test, development, production}))
        .pipe(gulp.dest('output'));
    return pages;
});

let lessPages;
gulp.task('less-compile-page', function () {
    lessPages = gulp.src(__dirname + '/pages/**/*.less', {base: '.'})
        .pipe(plumber())
        .pipe(less({
            paths: [__dirname + '/include/less']
        }))
        .pipe(gulp.dest('output'));
    return lessPages;
});

let appLess;
gulp.task('less-compile-app', function () {
    appLess = gulp.src(__dirname + '/bootstrap/app.less')
        .pipe(plumber())
        .pipe(less({
            paths: [__dirname + '/include/less']
        }))
        .pipe(gulp.dest('output'));
    return appLess;
});

gulp.task('build', [
    'bootstrap', 'less-compile-page', 'less-compile-app', 'pages', 'images', 'include'
]);

let taskSequence = function () {
    runSequence(['bootstrap', 'less-compile-page', 'less-compile-app', 'pages', 'images', 'include']);
};

gulp.task('watch', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
    taskSequence();
    return watch(['./pages/**', './bootstrap/**', './include/**', './images/**'], function (e) {
        let event = e.event;
        let taskName = e.base.split(path.sep).pop();
        if (event === 'unlink') {
            let outputPath = path.resolve(e.base, '..', 'output');
            let subPath = e.path.substr(e.base.length);
            let delPath = path.join(outputPath, taskName, subPath);
            del.sync(delPath);
        }
        else {
            taskSequence();
        }
    });
});

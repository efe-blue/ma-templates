/**
 * @file Build swan smart program config
 * @author <author>
 */

'use strict';

const path = require('path');
const rider = require('rider');

const DEV_SERVER_PORT = 9090;

module.exports = {
    verbose: false,
    root: path.join(__dirname, '..'),
    output: {
        dir: 'dist',
        depDir: 'src/common'
    },
    component: {
        extname: 'vue'
    },
    framework: [
        'data',
        'broadcast',
        'ref'
    ],
    // polyfill: ['async'],
    processors: {
        babel: {
            extnames: ['js']
        },
        stylus: {
            options: {
                use(style) {
                    style.use(rider());
                }
            }
        },
        postcss: {
            options: {
                plugins: {
                    px2rpx: {
                        // 设计稿尺寸
                        designWidth: 1242
                    }
                }
            }
        }
    },
    rules: [
        {
            match: '*.styl',
            processors: ['postcss']
        }
    ],

    server: { // 启用开发 Server
        port: DEV_SERVER_PORT,
        type: 'express', // 需要安装 express 依赖 npm i express apim-tools --save-dev
        middlewares: [
            // require('apim-tools').express({
            //     // 设置存储的 mock 相关数据存储的根目录
            //     root: __dirname + '/mock',
            //     // 项目 schema token 具体到 apim 平台查看
            //     schemaToken: 'xxx',
            //     // 是否启动时候立刻自动同步
            //     startAutoSync: true,
            //     port: DEV_SERVER_PORT
            // })
        ]
    },

    dev: {
        rules: [
            {
                match: /\.(png|jpe?g|gif)(\?.*)?$/,
                processors: {
                    tinyimg: {
                        replaceRaw: true
                    }
                }
            }
            // {
            //     match: 'src/**/*.vue',
            //     processors: [
            //         ['replacement', {
            //             'https://online.com': '${devServer}',
            //         }]
            //     ]
            // }
        ]
    }
};

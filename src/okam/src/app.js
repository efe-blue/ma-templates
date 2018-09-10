/**
 * @file 小程序入口
 * @author <author>
 */

'use strict';

export default {
    config: {
        pages: [
            'pages/home/index'
        ],

        window: {
            navigationBarBackgroundColor: '#211E2E',
            navigationBarTextStyle: 'white',
            backgroundTextStyle: 'light',
            enablePullDownRefresh: false,
            backgroundColor: '#ccc'
        },

        networkTimeout: {
            request: 30000
        }
    },

    $promisifyApis: []
};


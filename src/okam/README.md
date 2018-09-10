# 项目说明

> 基于 `okam` 开发框架开发的百度小程序

## 准备工作

* 安装 Node (`Node >= 6` && `npm >= 3`)

* 执行 `npm install`

## 开发

* 带 watch 开发模式：`npm run dev`

* 带 watch & 开发 Server 开发模式：`npm run dev:server`

* 删掉构建重新构建：`npm run build`

* 删掉构建产物：`npm run clean`

* 生成环境构建：`npm run prod`

## 目录结构说明

```
.
├── README.md
├── ci.yml
├── package.json
├── doc                 // 缓存项目源图片或者其它文档目录
├── dist                // 构建产物，开发工具得于该构建产物方能预览
├── .tinyimgcache       // 图片压缩的缓存信息，不可删掉，否则会导致图片重复压缩
├── project.json5       // 小程序项目配置文件，除了语法使用 JS 对象形式，配置说明参考官方小程序说明
├── scripts             // 构建相关脚本
│   ├── build.js        // 构建入口脚本
│   ├── build.sh        // CI 脚本
│   └── swan.config.js  // 开发框架构建配置文件
└── src                 // 项目源码
    ├── app.js          // 小程序入口脚本
    ├── app.styl        // 小程序入口样式
    ├── common          // 项目公共代码
    │   ├── biz         // 项目公共业务代码
    │   ├── css         // 项目公共基础样式
    │   ├── img         // 项目图片资源
    │   └── tpl         // 项目公共模板文件
    ├── components      // 自定义组件
    └── pages           // 小程序页面集合
        ├── home        // 首页
        ├── ...
        └── ...
```

## 开发框架说明

### App 入口脚本

```javascript
// 整体定义同原生小程序
export default {
    config: {
        pages: [
            'pages/home/index'
        ],

        window: {
            backgroundColor: '#000'
        }
    },
    // 声明项目中需 Promise 化的 api 接口, 同原生小程序
    $promisifyApis: ['getSystemInfo'],
    globalData: {},
    onLaunch() {}
};
```

* 扩展API
    * `$api`: 所有原生小程序 API，都可以通过该属性访问到，e.g., `this.$api.getsystemInfo()`,
    * `$global`: 获取全局对象
    * `$http`: 发起 HTTP 请求接口对象，参考下面 `HTTP 请求` 章节
    * `$promisifyApis` `Array.<string>`: 声明要转成 `Promise` 原生接口列表

### 页面定义

* 单文件组件定义方式，类似于 Vue

* 模板语法，类似于 Vue，除了有些限制外
    * 指令名都没有前缀 `v-`，直接 `if` `else` `elif` `for`
    * 事件
        * 支持修饰符 `.stop` `.capture` `.capture.stop`

        ```
            @click -> bindtap
            @click.stop -> catchtap
            @click.capture -> capture-bindtap
            @click.capture.stop -> capture-catchtap
        ```

        * 直接传参 `@tap = "method(arg1, arg2, $event)"`

* Page 实例扩展 Api

    * `$api`: 同 App
    * `$global`: 同 App
    * `$http`: 同 App
    * data 操作语法类似于 Vue，支持 `computed`
    * `$nextTick`: 类似于 Vue
    * `$query`: 获取当前页面查询参数

```vue
<template>
    <view class="home-wrap">
         <view class="home-wrap">
            <button class="hello-btn" @click="onHello">{{computedProp}}</button>
            <view class="click-tip" if="clicked">You click me~</view>
        </view>
    </view>
</template>
<script>
export default {
    config: { // 同原生小程序配置，部分配置项提供缩略写法，比如 title
        title: 'Page Title'
    },

    data: { // 同原生小程序
        btnText: 'xxx'
    },

    computed: {
        computedProp() {
            return this.btnText + '-suffix';
        }
    },

    // 生命周期钩子
    // 同 onLoad
    created() {},
    // 同 onReady
    ready() {},
    // 同 onUnload
    destroyed() {},

    // 显示、隐藏钩子
    onShow() {},
    onHide() {},

    methods: {
        // 事件绑定方法，或者其它方法定义都放在这里
        onHello() {
            this.btnText = 'yyy'; // 直接赋值即可
        }
    }
};
</script>
<style lang="stylus">
</style>
```

### 自定义组件定义

TODO

### 使用 Async Await 语法

* `swan.config.js` 加上如下配置：

```javascript
{
    polyfill: ['async']
}
```

### 样式定义

* 使用 Stylus

* 配合 Rider 扩展库：具体可以参考[这里](https://github.com/ecomfe/rider)

* 配置 px2rpx 设计稿尺寸，直接写设计稿对应的 px 值

    `swan.config.js` 加上如下配置：
    ```javascript
    {
        processors: {
            postcss: {
                options: {
                    plugins: {
                        px2rpx: {
                            // 设计稿尺寸
                            designWidth: 1242,
                            // 保留的小数点单位, 默认为 2
                            precision: 2
                        }
                    }
                }
            }
        },
    }
    ```

### HTTP 请求

* 使用 `$http` 对象请求

* 该接口封装后返回的是 `Promise` 对象，如果需要兼容小程序不支持 `Promise` 情况，在 `swan.config.js` 构建配置加上如下配置：

    ```javascript
    {
        polyfill: ['promise']
    }
    ```

* 使用示例

    ```javascript
    // get request
    this.$http.get(url, {}).then(
        res => {},
        err => {}
    );

    // post request
    this.$http.post(url, {}).then(
        res => {},
        err => {}
    );

    // 自定义请求 method
    this.$http.fetch(url, {method: 'PUT'}).then(
        res => {},
        err => {}
    );
    ```

### 本地 Mock 数据请求接口

* `swan.config.js` 加上如下配置：

```javascript
{
    server: { // 启用开发 Server
        port: 9090,
        type: 'express', // 需要安装 express 依赖 npm i express apim-tools --save-dev
        middlewares: [
            require('apim-tools').express({
                // 设置存储的 mock 相关数据存储的根目录
                root: __dirname + '/mock',
                // 项目 schema token 具体到 apim 平台查看
                schemaToken: 'xxx',
                // 是否启动时候立刻自动同步
                startAutoSync: true
            })
        ]
    },

    dev: { // 开发环境配置，构建时候命令行参数加上： NODE_ENV=dev
        rules: [
            {
                match: 'src/**/*.vue',
                processors: [
                    ['replacement', {
                        'https://online.com': '${devServer}',
                    }]
                ]
            }
        ]
    },
}
```

### 图片压缩处理
* `swan.config.js` 加上如下配置：

```javascript
{
    dev: { // 开发环境配置，构建时候命令行参数加上： NODE_ENV=dev
        rules: [
            {
                match: /\.(png|jpe?g|gif)(\?.*)?$/,
                processors: {
                    tinyimg: {
                        // boolean 是否替换源文件, 默认为 false
                        replaceRaw: true,

                        // 若 replaceRaw 为 true, 源文件存放的位置，默认为 'doc/img' (相对于项目根文件, 不提交)
                        releaseSourcePath: 'doc/img'
                    }
                }
            }
        ]
    },
}
```


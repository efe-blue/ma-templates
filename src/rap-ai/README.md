# rap-ai

有嘻哈showcase

- pages/index/index     首页(caixiaowen)
- pages/home/home       个人中心页(jiangyanfu)
- pages/album/album     作品合集页(liuchaofan)
- pages/music/music     选择歌曲页(caixiaowen)
- pages/record/record   录音页(jiangyanfu + wangshuo)
- pages/generate/generate 音乐合成页(jiangyangfu + wangshuo)
- pages/play/play       单曲作品页(jiangyanfu)
- pages/guide/guide     开始录音引导页
- weixin.html           分享落地页   (wangshuo)

# swanid
小程序有一个专属的id，swanid，具体的文档请参照小程序的开发文档，在项目中，swanid被当做用户唯一标识使用，
下文中的userid和swanid是等价的。

# 上线checklist
- 确认globalData里面的shareUrl协议为https，如果地址有变动，需要和开发七巧板相关同学确认
- 确认所有调试用的showToast和showModal都被删除干净
- 确认代码为index-page分支，且已经同步过远程代码
- 确认app.js里面的env变量的值为online，这个表明接口连接的是线上环境
- 上线前使用预览功能生成的二维码，测试一遍主流程（选歌 + 录音 + 生成 + 播放 + 保存）
- 如果appid发生了修改，需要通知RD更新注册接口的相关信息
- 如果appid发生了修改，需要找曲佳妍给这个appid添加获取cuid的权限
- 如果有样式以及文案上的更新，需要同步到world分支，world分支为离线包代码所在分支

# 保存流程
首先需要明确的是，在用户录制完成之后，相关的音频已经存在数据库中了，但是因为法务强调说，必须用户明确的点击保存，上传这样的按钮，我们才可以
使用用户的数据。
其次，保存分为已登录保存和未登录保存
已登录保存 -> 询问用户是否获得了授权 -> 获取用户信息 -> 获取cuid -> 调用保存接口
未登录保存 -> 获取cuid -> 登录 -> 获取登录后的swanid -> 获取用户信息 -> 上传

# 注册接口（/rap/register）
参照小程序内的获取userInfo的流程，首先，通过login获取code，然后通过getSwanId获取swanId
将这两个值作为参数传递给注册接口，服务端会去开放平台（openai.baidu.com）进行注册。注册成功后
调用getUserInfo才能成功。

# 接口地址
http://wiki.baidu.com/pages/viewpage.action?pageId=493778988
# 交互文档
http://newicafe.baidu.com/issue/xiaochengxu00-839/show?from=page
# 分享落地页代码地址
http://icode.baidu.com/repos/baidu/efe-blue/rap-share/tree/master

# promisify
因为小程序的接口几乎都带有success, fail, complete三个回调，在多个API连续调用的情况下，项目对API进行了promisify，具体参考include/util中的代码

# 接口说明

- 一级id=歌曲（背景音频）对应到接口文档中是rapId
- 二级id=歌曲+对应歌词 对应到接口文档中是lyricid（每个一级id下对应上限不超过5套歌词，默认0为原唱歌词，例：一级ID为01，该歌曲对应原唱歌词的二级id为01-0）
- 三级id=二级id+用户uid（swan id）(例：用户名=mc cia，该用户创作的某歌曲的三级id为=01-0-mc cia) auidId
- 四级id=若同一个用户用同一个曲子同一套歌词，上传了多次，则用四级id区分。这部分server端负责维护

# 文档上没有的私有API
- swan.getCommonSysInfo
1.获取cuid，私有API，每次调用的时候需要向服务端发送请求鉴权，appid要由曲佳妍在平台上开通权限。

- swan.openshare
1.因为生态原因，不能让百度之外的人拥有自定义分享的权限，这里的私有API能调起分享面板
2.在页面中能够调起分享的方式，对外的只有两种方式，一个是open-type属性为share的button组件，一个是顶部bar的三个点

# 全局配置
- app.js里配置开发机服务器地址

# mock使用方法
- 执行npm run dev
- 可以在浏览器上访问具体的url，比如http://127.0.0.1:8888/rap/list，在mock文件夹下面就会生成相应的mock文件
- 按照接口文档修改mock文件模拟数据请求，可再访问http://127.0.0.1:8888/rap/list看返回数据是否成功

# 调用接口
- 在util.js中写一个共用的调接口函数fetchData(url,params)。相似的，如果用共用函数，可定义在util.js中，然后通过require引用该函数

# 开发环境说明

## components
因为目前小程序的开发不支持子组件的方式，因此子组件的less和swan文件写在这里。
less在使用子组件的地方使用`@import`的方式引入，swan文件使用`@@include`的方式进行引入

## bootstrap
与app相关的配置文件写在这里

## include
这里可以写需要引入的less文件与js文件

## output
使用开发者工具打开这个文件

## gulp
执行gulp build或npm run release或者npm run release:watch，可以生成output文件夹

## 打点
基础的打点小程序结合百度统计已经做了
剩下的工作需要自定义事件来做
在小程序自定义事件需要两个参数：
- eventName类型为String，事件名。
- data为Object对象，指上报的自定义数据。key为配置中的字段名，value为上报的数据
```
swan.reportAnalytics('purchase', {
    price: 120,
    color: 'red'
})
```

事件名称举例（登录---login）
必传的参数：
- userid, rapid, audioid，lyricid
- page path
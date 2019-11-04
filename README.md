
[TOC]
# react-cnode-study
从0-1的学习react的服务端渲染，不过使用的是webpack的3.x版本，先按照这些来使用，后续可以自己在进行改造
[学习来源](https://coding.imooc.com/class/chapter/161.html#Anchor)

## 小技巧

**npm换行**
> 添加\然后回车就好

**json或则类似json的格式可以进行注释**
在配置中进行如下配置
``` json
"files.associations": {
    "*.json": "jsonc",
    ".eslintrc": "jsonc"
}
```

## 疑惑

> server端 externals 了 dependencies 里面的库，那么是不是服务端打包的时候需要进行 npm install 的安装了？

> server端 如何加载自己定义的css？而且现在有 dense of undefined报错

@material-ui/core 版本安装 3.3.0 ，解决报错问题

> server端 刷新之后样式就不见了？原因是因为 app.js 没有替换掉root内容？

不推荐解决方案：我现在发现比较挫的解决方案是：hydrate 替换成 render

原理找到了：
1. hydrate会**服用**服务端生成的html代码，所以**虚拟dom**会服用，但是复用的时候class是不会进行监听的，所以appString的内容是没变的，但是这个时候引用的style改变了
2. material-ui 的bug，服务端生成既然和客户端生成的 classname 不一致，这个导致了现在的问题

解决方案：
1. 添加 sheetManger = new map() 这样可以解决一部分class改变，但是没有彻底解决
2. Avatar组件不用用listItem包装,但是还是解决不彻底

** 后续有空把 material-ui 升级到最新版本，看看可不可以解决 **

> 正式环境样式错乱 `npm run start`?

因为设置了NODE_ENV=production，material-ui在正式环境打包的className是简介版本的，导致了一些 client & server class不一致冲突
解决：不设置 NODE_ENV=production就可以（后续有更好的方法在研究下）


## 工程架构

#### webpack基础配置

配置输入以及输出，通过参数[name][hash]，每次文件的改变都会引起hash值的改变
webpack默认支持js的


### webpack loader的基本应用

我们需要jsx语法，webpack默认是不支持的，所以需要loader进行转化
需要安装react-dom,可以对比react-native.一个是浏览器上的，一个是手机端的
就算没有使用到React也要import，因为所有的jsx语法都需要转译成React.createElement
+ babel-loader 默认支持了jsx语法转换
+ babel-core loader只是进行转换，但是一些底层还是需要babel-core进行,转成ast树
+ .babelrc 进行具体的配置
    - 支持什么转换  preset中进行编写 babel-preset-es2015支持es6
    - react 支持react转换


### 服务端渲染基础配置

#### 单页应用存在的问题？

+ SEO不友好，一开始取回来的只是一个没有内容的html，需要后续去填充
+ 首次加载慢，因为有很多的js和css需要去加载

#### 开始进行服务端配置

配置一下package.json build的时候client和server都能出来，使用rimraf清除dist目录（在webpack使用CleanWebpackPlugin也可以）
服务端渲染跟客户端渲染不同：后台生成html，然后一起渲染给前端
过程：
+ 定义一个 server-entry.js，内容是 export <App />
+ 使用react-dom/server 把 server-entry renderToString 成string
+ 把上面的string插入到template.html的root下面（这样就可以使用跟客户端一样的template.html)
+ 需要npm run build，在进行npm run start

疑惑：
    服务端渲染哪里加强了SEO了？不都只是替换掉root里面的内容吗？也都引用了外部的js
解答：
    可以对比一下浏览时候的html，会发现服务端渲染时候里面已经包含了hello word。引用外部js可能是为了另外一个话题了

### webpack-dev-server配置

注意点： 需要删除掉dist，否则进行historyApiFallback的时候会报错（因为会先去找本地的dist，没有在找缓存）

### hot-module-reaplacement

热更新流程：
1. 普通热更新
    + webpack.config中开启hot:true,并且调用plugin：new webpack.HotModuleReplacement()
    + moudle.hot.accept()即可，不过state每次刷新的时候都会重置
2. 兼容react的热更新
    + 安装react-hot-loader
    + webpack.congif entry中加入react-hot-loader/patch
    + 配置.babelrc,plugins中添加react-hot-loader/babel，如果全是es5的话可以不使用babel，因为jsx有可能使用es6和react语法
    + app.js使用module.hot.accept监听App.jsx重新render（好像是使用了websocket推送），AppContainer进行包裹这样state状态才可以保留
遇到的坑：
    为啥public后面也要斜杠，因为热更新的js也会使用这个publicPath，如果没有/，则public080999.js,正常应该是public/080999.js，可以打开chrome-network-preserve log进行查看

### 开发时的服务端渲染

问题： 服务端渲染不想每次有所改动都需要重新编译打包?
解决思路：
1. 获取html：通过axios读取打包后的index.html,注意是/public/index.html
2. 获取打包后的server-entry.js: 在js中引入webpack，进行watch，每次都从缓存中读取bundle.js(但是路径还是要写成dist下面)
3. express.static的public解决：通过代理，把所有的/public都代理到dev:client启动的服务上

疑惑：这样之后为什么服务端也可以进行热更新了？
渲染完成之后，还是会调用client端的js代码的，可以看日志发现调用了app.js

### 使用eslint和editConfig规范代码

eslint：进行代码检查，是否符合rule规范；可以配合编辑器使用，在书写的时候就给出提示
editorconfig: 不同编辑器(系统）对文本的处理格式有些不一样，如果不统一规范，可能代码拉下来会报错

[eslint规则查看](http://eslint.cn/docs/rules/)
[editconfig参考](https://www.jianshu.com/p/a11c679e21bf)

**eslint安装使用总结：**
+ .eslintrc中使用parser： babel-eslint
+ webpack rules配置 eslint-loader
```
npm i -d eslint babel-eslint(.eslintrc使用的到)) eslint-loader
    eslint-config-standard 最外层的.eslintrc使用到
    eslint-eslint-airbnb（涉及到很多peerDependencies,所以也要安装）
        可以通过npx install-peerdeps --dev eslint-config-airbnb进行安装依赖
```
**editorconfig使用：**
+ vscode需要安装相应的插件(EditorConfig for VS Code)，会自动显示出来（webstorm自动集成).不安装是没有效果的
+ 添加.editorconfig，配置所需即可

**在git提交之前进行检查，如果不符合规则那么就提示错误**
> 进行hook操作，现在可以npm i -d husky(哈士奇)安装；package.json里面进行`precommit`,会监听这个script

### 工程架构优化

使用webpack-merge
1. npm i -D webpack-merge
2. webpack.base.js编写客户端和服务端公用的部分
3. WebpackMerge(baseConfig, {xxx}),会进行深度复制

解决favicon问题，服务端会出现（如果客户端缓存刷新的话也出现）
1. 服务端找不到会直接返回html
2. 思路：在template中添加link icon，不过因为webpack还没有配置图片的，所以这个思路不采纳
3. 使用[serve-favicon](https://www.npmjs.com/package/serve-favicon)
  + npm i -D serve-favicon
  + app.use(favicon(path.resolve(__dirname, 'favicon.ico')))

每次修改服务端代码，都需要重新启动，太麻烦了
解答：使用nodemon
1. npm i -D nodemon
2. 进行nodemon.json配置，直接在json中配置导致nodemon执行的时候报错
```js
{
  "restartable": "rs", // 现在安装的这个版本已经不需要了，老版本还是需要的，否则配置了nodemon么有这一行修改无用
  "ignore": [
    ".git",
    "node_modules/**/node_modules", // 包括node_modules下的所有文件以及node_modules
    "client",
    ".eslintrc",
    "build"
  ],
  "env": {
    "NODE_ENV": "development" // ~~nodemon是不能NODE_ENV=development nodemon xxx.js这么使用的，要使用本行~~ 可以使用，之前理解有误
  },
  "verbose": true, // 输出更多的信息查看报错结果
  "ext": "js" // 只有js改变时候才触发
}
```

扩展：nodemon vs pm2
+ nodemon: 替代node进行更好的自动启动;
+ pm2: 添加--watch就跟nodemon一样了，不过更适合生产环境，因为有cpu使用率、RAM等的一些记录日志


## 项目架构

### 目录结构

client
├── app.js
├── component             // 跟业务无关组件或则公用组件
├── config                // 配置文件
│   └── router.jsx
├── server-entry.js
├── store                 // 状态管理相关
│   └── store.js
├── template.html
└── views                 // 添加页面的地方
    ├── App.jsx
    ├── topic-detail
    │   └── index.jsx     // 规定每个组件都用index.jsx来表示
    └── topic-list
        └── index.jsx

遇到的问题：
>git commit -m 的时候报错，但是执行的时候却没有
原因是运行时如果没有引用该组件是不会去检查的，而commit时候触发npm run lint钩子，所以全部会检查

### 路由配置

技巧：不想要外面有包裹的元素，可以使用数组，这样就都是兄弟元素了

1. npm i -D react-router-dom
  > react-router-dom需要依赖react-router,如果没有安装依赖使用提示问题就需要安装，正常情况下会自动安装
2. 在config/router.jsx中配置
  + Switch 代表碰到一个就直接返回，不使用都匹配就都返回
  + exact 完全匹配才返回
3. Router进行Route、Link的包裹,要不然不可使用

> 为什么react-router-dom需要依赖react-router?

react-router理解成基础路由，react-router-dom适合浏览器，react-router-native适合移动端，所以了他们都继承了react-router，如果以后还有什么直接继承react-router就好，不需要重新编写重复代码了。

> Redirect的使用？

1. 在Route中使用：render={()=><Redirect to='xxx' />}，配合exact
2. 直接使用： <Redirect from='aa' to='bb' />,不过需要配合Switch

> render中不需要外部容器？

return [<div></div>,<div></div>]

### store配置(1)-概念对比redux

本章主要是把redux和mobx进行了比较

两个最简本代码的比较
+ [mobx](/Users/liulei/Documents/GitHub/REACT/react-redux-dva教学/status/mobx/simple-mobx/跟最简单redux比较.js)
+ [redux](/Users/liulei/Documents/GitHub/REACT/react-redux-dva教学/status/redux/index-base.js)
[详细的比较](https://juejin.im/post/5a7fd72c5188257a766324ae)
mobx是由多个store组成的，使用的时候在把相应的store注入到各个组件，
而redux只有一个store，通过connect进行关联mapStateToProps,mapDispatchToProps

mobx优点：
+ 更加的简洁，类似于vue的vuex。只需要observable和action就可以做redux的基本事情。
+ 效率更高，可以直接修改初始值属性，而不是返回一个新的初始值
mobx缺点：
非严格模式下大家可以随意更改属性，而不需要通过action

redux优点：更加的规范流程化
redux缺点：繁琐

### store配置（2）-使用

使用mobx以及装饰器：
1. npm i -D babel-preset-stage-1 babel-plugin-transform-decorator-legacy
  > stage-1是不包含插件tranform-decorators-legacy的
2. npm i -S mobx mobx-react
3. 每个使用的地方都创建一个Store，比如全局的就是app-state.js
  > 使用class+decorator是比较好的实践
注意点：mobx5.x版本使用到proxy，会不兼容ie11版本，可以降级到4.x

可以使用babel-node直接执行client/store/app-state.js,查看效果

在react中使用mobx
1. import {Provider} from 'mobx-react'
2. Provider加载放在hot的下面一层，并且属性appState={appState}
3. class上面@inject('appState')：注入props； @observer：监听后续的改变
  > 如果export default配合装饰器会报错，记得在.eslintrc中配置

> 发现没有使用babel-plugin-transform-class-property也可以使用在class使用static和箭头函数，这个后续要看看具体是啥原因

因为stage-1包含了babel-plugin-transform-class-property,react-webpack里面使用的是stage-3，如果不配合-class-property使用，使用static以及class中的箭头函数是会报错的

> 在本章中我们有很多测试无用的代码，后续都可以删除

### Cnode API代理实现

实现了两个代理：login和其他接口

发现/api/user/login指向login,还需要保存相应的session，没有的则默认401.

发现/api开头，则获取后面的path然后拼装成api去调用.
1. 判断是否有session，没有则401
2. get请求和post请求包装一下，query和body都加上
  > 使用application/x-www-form-urlencoded是因为有的接口application/json会报错。但是前端发送的时候是可以使用application/json
3. 发送接收到的相应的请求给前端

主要学习的是插件的使用：
body-parser、express-session、query-string的使用，相应的可以查看node-study/plugin

### 调试接口代理

添加一个路由页面test.api.jsx进行调试，主要测试：无accessToken接口、login、有accessToken接口

> 问题：服务端渲染启动的时候，如果访问localhost:3333会报错，err: Error: Invariant failed: You should not use <Link> outside a <Router>
这个问题下面会解决，~~所以现在页面使用的化，需要使用代理~~（这个问题跟代理无关）

  ```js
    proxy: {
      '/api':'http://localhost:3333' // localhost:3333/api代理到localhost:8888/api上面
    }
  ```
~~这个问题还是要解决的，都服务端渲染了还用啥proxy啊～后续修复~~之前理解错误

axios的post请求主体是 data， fetch的post请求主体是 body。不要弄混了，要不然测试bug会花很多时间

### 服务端渲染优化-1

上一章问题：加入router和store后，服务端渲染出现问题，如何解决？

> 如果不使用开发时候服务端的代码？那是不是就不需要在乎了？

  不是，因为生成的server-entry还是有router和store的代码在里面

> 解决路由跳转问题
+  在server-entry.js中添加react-router-dom专门为服务端渲染的router的StaticRouter
  > 解决了之前的报错，但是服务端`<!--app>`被替换成了空，没有数据

> 解决服务端store问题

  请求两次，浪费（没有理解老师的意思）

现在实现的功能：
1. 可以进行路由的跳转
2. 首次的mobx-state可以访问到

问题：
1. 如果mobx 的state进行了更改的话怎么通知服务端重新进行渲染
2. 如果路由跳转的话在哪里进行跳转

### 服务端渲染优化-2

>路由跳转

通过routerContext.url来获取是不是要进行跳转，如果需要就服务端 status 302 然后跳转（设置header头的Location）

> mobx-state的改变
1. react-async-bootstrapper可以在服务端进行监听，client代码里面进行修改
  > 初始化使用还有bug，服务端state修改了，但是前端还是没有修改
2. 获取到的store是getter和setter格式，转成json格式
  > 每次都需要刷新两次才能正确，否则服务端显示xxx不是function？后续有答案在解答
3. 通过模板代码把转成的json格式替换到html中去
  + ejs，因为webpack也会解析ejs，所以需要<%%- appString %>
    + 默认的使用就是html 中使用htmlWebpackPlugin.options.title(重点是options)
  + window.__INITIAL_STATE__ 这种命名就是为了不重复
  + 服务端的state转成string，然后替换ejs中内容
  + app-state添加constructor，里面的参数就是初始值 window.__INITIAL_STATE__

思考：服务端渲染的主要解决什么
1. 渲染速度
2. SEO
> 跟是否可以触发事件是无关的，比如 topic-list 里面，如果只是使用服务端渲染没有引入 appxxxx.js，那么是不会触发 change 事件的

> 未解决
SEO和TITLE问题

### 服务端问题解决mbox的warning

mbox的warning：每次刷新的时候都会重新打包server-entry.js，这样就会形成多个mbox的实例，导致错误（现在版本没有，课程中是有提示的）
解决方案：
1. webpack.externals 把package.json的包都去掉，服务端默认会使用require引入
  > (new Module()).compile(bundle,'server-entry.js')使用reuiqre会报错
2. 替换掉之前的编译模式，改用可以获取的方式（vm NativeModule require)

### 解决SEO问题

SEO：主要是title和meta
<title>这个是需要被seo的标题</title>
<meta name='描述' content='具体的描述信息' />
[更详细的SEO规则](http://wiki.jpushoa.com/pages/viewpage.action?pageId=17538491)

参照react-async-bootstrapper，在组件里面编写具体的内容，然后server里面可以获取到，然后渲染到ejs中

我们选用react-helmet
1. 在client情况下也可以使用，只是也是后续渲染上去的
2. 在server端使用，可以Helmet.rewind(),然后相应的属性.toString()

### 将服务端渲染用于生产环境

把公用代码提取出来，放在server-render.js中

next是发到下一个中间件，使用app.use((error, req, res, next)=>{})来统一处理错误

serverBundle不存在情况下，提示客户等下再次进行刷新（这个只有开发环境才会遇到，也是之前时常出现的问题）

**npm start 之前既然不知道为啥，原来只有npm run start才可以npm start**

## 业务开发

### React16 介绍

新特性：
1. error Bundle,如果没有使用source-map的话，这个可以帮忙快速定位到错误代码
2. New render return types,可以不需要外层的dom，直接[<p>xxx<p>,<p>yyy</p>]
3. Portals,可以在一个dom节点下插入组件。应用：弹窗插入到body中
4. Better server-side rendering,
  + 如果服务端渲染之后客户端不进行再次渲染，可以使用React.hyrate
  + 如果是顺序渲染，可以使用streming形式，这样可以先显示一部分，后续加载之后在渲染（我们使用的不是，因为我们不是顺序相关）

### material 使用

[参考文档3.x版本](https://v3.material-ui.com/getting-started/installation/)
material使用：需要用到什么就引用什么
关键点：material生成的css需要在服务端生成插入

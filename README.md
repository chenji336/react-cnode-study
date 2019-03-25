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

## 工程架构

#### webpack基础配置
配置输入以及输出，通过参数[name][hash]，每次文件的改变都会引起hash值的改变
webpack默认支持js的


### webpack loader的基本应用
我们需要jsx语法，webpack默认是不支持的，所以需要loader进行转化
需要安装react-dom,可以对比react-native.一个是浏览器上的，一个是手机端的
就算没有使用到React也要import，因为所有的jsx语法都需要转译成React.createElement
+ babel-loader 默认支持了jsx语法转换
+ babel-core loader只是进行转换，但是一些底层还是需要babel-core进行
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
+ 定义一个server-entry.js export <App />
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
    + moudle.hot.accept()即可，不过state每次刷新的时候都会重制
2. 兼容react的热更新
    + 安装react-hot-loader
    + webpack.congif entry中加入react-hot-loader/patch
    + 配置.babelrc,plugins中添加react-hot-loader/babel，如果全是es5的话可以不使用babel，因为jsx有可能使用es6和react语法
    + app.js使用module.hot.accept监听App.jsx重新render（好像是使用了websocket推送），AppContainer进行包裹这样state状态才可以   保留
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
+ vscode需要安装相应的插件，会自动显示出来（webstorm自动集成)
+ 添加.editorconfig，配置所需即可

**在git提交之前进行检查，如果不符合规则那么就提示错误**
> 进行hook操作，现在可以npm i -d husky(哈士奇)安装；package.json里面进行`precommit`,会监听这个script

### 工程架构优化

使用webpack-merge
1. npm i -D webpack-merge
2. webpack.base.js编写客户端和服务端公用的部分
3. WebpackMerge(baseConfig, {xxx}),会进行深度复制

解决favicon问题，服务端会出现（如果客户端缓存刷新的话也出现）
1. 服务端找不到会定直接返回html
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
    "NODE_ENV": "development" // nodemon是不能NODE_ENV=development nodemon xxx.js这么使用的，要使用本行
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
  > react-router-dom需要以来react-router,如果没有安装依赖使用提示问题就需要安装，正常情况下会自动安装
2. 在config/router.jsx中配置
  + Switch 代表碰到一个就直接返回，不使用都匹配就都返回
  + exact 完全匹配才返回
3. Router进行Route、Link的包裹,要不然不可使用

> 为什么react-router-dom需要依赖react-router?

react-router理解成基础路由，react-router-dom适合浏览器，react-router-native适合移动端，所以了他们都继承了react-router，如果以后还有什么直接即成react-router就好，不需要重新编写重复代码了。

> Redirect的使用？

1. 在Route中使用：render={()=><Redirect to='xxx' />}，配合exact
2. 直接使用： <Redirect from='aa' to='bb' />,不过需要配合Switch

> render中不需要外部容器？

return [<div></div>,<div></div>]

### store配置(1)

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
redux缺点： 繁琐




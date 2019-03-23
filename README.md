# react-cnode-study
从0-1的学习react的服务端渲染，不过使用的是webpack的3.x版本，先按照这些来使用，后续可以自己在进行改造

## webpack基础配置
配置输入以及输出，通过参数[name][hash]，每次文件的改变都会引起hash值的改变
webpack默认支持js的


## webpack loader的基本应用
我们需要jsx语法，webpack默认是不支持的，所以需要loader进行转化
需要安装react-dom,可以对比react-native.一个是浏览器上的，一个是手机端的
就算没有使用到React也要import，因为所有的jsx语法都需要转译成React.createElement
+ babel-loader 默认支持了jsx语法转换
+ babel-core loader只是进行转换，但是一些底层还是需要babel-core进行
+ .babelrc 进行具体的配置
    - 支持什么转换  preset中进行编写 babel-preset-es2015支持es6
    - react 支持react转换


## 服务端渲染基础配置

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


## webpack-dev-server配置
注意点： 需要删除掉dist，否则进行historyApiFallback的时候会报错（因为会先去找本地的dist，没有在找缓存）

## hot-module-reaplacement
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

## 开发时的服务端渲染
问题： 服务端渲染不想每次有所改动都需要重新编译打包?
解决思路：
1. 获取html：通过axios读取打包后的index.html,注意是/public/index.html
2. 获取打包后的server-entry.js: 在js中引入webpack，进行watch，每次都从缓存中读取bundle.js(但是路径还是要写成dist下面)
3. express.static的public解决：通过代理，把所有的/public都代理到dev:client启动的服务上

疑惑：这样之后为什么服务端也可以进行热更新了？
渲染完成之后，还是会调用client端的js代码的，可以看日志发现调用了app.js

## 使用eslint和editConfig规范代码
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

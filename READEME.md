#react-cnode-study
从0-1的学习react的服务端渲染，不过使用的是webpack的3.x版本，先按照这些来使用，后续可以自己在进行改造

##webpack基础配置
配置输入以及输出，通过参数[name][hash]，每次文件的改变都会引起hash值的改变
webpack默认支持js的

##webpack loader的基本应用
我们需要jsx语法，webpack默认是不支持的，所以需要loader进行转化
需要安装react-dom,可以对比react-native.一个是浏览器上的，一个是手机端的
就算没有使用到React也要import，因为所有的jsx语法都需要转译成React.createElement
+ babel-loader 默认支持了jsx语法转换
+ babel-core loader只是进行转换，但是一些底层还是需要babel-core进行
+ .babelrc 进行具体的配置
    - 支持什么转换  preset中进行编写 babel-preset-es2015支持es6
    - react 支持react转换

##服务端渲染基础配置
####单页应用存在的问题？
+ SEO不友好，一开始取回来的只是一个没有内容的html，需要后续去填充
+ 首次加载慢，因为有很多的js和css需要去加载
####开始进行服务端配置
配置一下package.json build的时候client和server都能出来，使用rimraf清除dist目录（在webpack使用CleanWebpackPlugin也可以）
服务端渲染跟客户端渲染不同：后台生成html，然后一起渲染给前端
过程：
+ 定义一个server-entry.js export <App />
+ 使用react-dom/server 把 server-entry renderToString 成string
+ 把上面的string插入到template.html的root下面（这样就可以使用跟客户端一样的template.html)
+ 需要npm run build，在进行npm run start
疑惑： 
    服务端渲染哪里加强了SEO了？不都只是替换掉root里面的内容吗？也都引用了外部的js

##webpack-dev-server配置
注意点： 需要删除掉dist，否则进行historyApiFallback的时候会报错（因为会先去找本地的dist，没有在找缓存）
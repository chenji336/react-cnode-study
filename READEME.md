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
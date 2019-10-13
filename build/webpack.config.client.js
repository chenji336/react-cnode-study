const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name][hash].js',
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'), // 可以直接设置在module.loaders中 https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md [!!说明](https://github.com/webpack/docs/wiki/loaders)
      filename: 'server.ejs'
    }),
  ]
})

if (isDev) {
  config.entry = {
    app: [
      'react-hot-loader/patch', // 热更新需要的js，也打包到app[hash]去
      path.join(__dirname, '../client/app.js')
    ],
  }
  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    // contentBase: path.join(__dirname, '../dist'), // 内容的缓存位置,默认先进入这里查找index.html [可以参考](/Users/liulei/Documents/GitHub/tool/webpack/offical-study/指南/05开发/webpack-demo-contentBase)
    hot: true, // 进行热加载，现在还没有，所以先不需要
    overlay: {
      errors: true // 报错的时候出现一个悬浮层出现错误
    },
    publicPath: '/public', // 所有的文件都需要在前面加上/public，默认是没有;对应着output-publicPath里的内容
    historyApiFallback: { // 很恶心的一个错误就是因为dist目录已经存在，导致查找js有问题
      index: '/public/index.html' // 所有的404都会进入到index.html
    },
    proxy: {
      '/api': 'http://localhost:3333', // 把localhost:3333/api代理到localhost:8888/api上
    },
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.devtool = 'inline-source-map' // 添加source-map,否则报错都不知道具体位置
}

module.exports = config

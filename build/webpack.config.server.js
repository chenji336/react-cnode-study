const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = webpackMerge(baseConfig, {
    target: 'node', // 表示在node环境里面执行，默认的是web(查看打包的js，node的是module.exports)
    entry: {
        app: path.join(__dirname, '../client/server-entry.js')
    },
     externals: Object.keys(require('../package.json').dependencies), // 不要打包所有的package.json里面的，服务端渲染会使用require进行引用
    output: {
        filename: 'server-entry.js',
        libraryTarget: 'commonjs2'
    },
})

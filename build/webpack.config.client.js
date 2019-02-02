const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const isDev = process.env.NODE_ENV === 'development'

const config = {
    entry: {
        app: path.join(__dirname, '../client/app.js')
    },
    output: {
        filename: '[name][hash].js',
        path: path.join(__dirname,'../dist'),
        publicPath: '/public/' // 坑：为啥public后面也要斜杠，因为热更新的js也会使用这个publicPath，如果没有/，则public080999.js,正常应该是public/080999.js，可以打开chrome-network-preserve log进行查看
    },
    module: {
        rules: [
            {   
                test: /.(jsx|js)$/,
                loader: 'eslint-loader',
                enforce: 'pre', // 每次打包前进行检查，如果出现错误则不执行下去
                exclude: [
                    path.resolve(__dirname, '../node_modules') // 不检查node_modules
                ]
            },
            {
                test: /.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /.js$/,  // 分开写是因为不想要编译node_modules中的js，因为已经编译过一遍了
                loader: 'babel-loader',
                exclude: [
                    path.join(__dirname, '../node_modules')
                ]
            }
        ]
    },
    plugins: [
        new HTMLPlugin({
            template: path.join(__dirname, '../client/template.html')
        })
    ]
}

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
        contentBase: path.join(__dirname, '../dist'), // 内容的缓存位置
        hot: true, // 进行热加载，现在还没有，所以先不需要
        overlay: {
            errors: true // 报错的时候出现一个悬浮层出现错误
        },
        publicPath: '/public', // 所有的文件都需要在前面加上/public，默认是没有;对应着output-publicPath里的内容
        historyApiFallback: { // 很恶心的一个错误就是因为dist目录已经存在，导致查找js有问题
            index: '/public/index.html' // 所有的404都会进入到index.html
        }

    }
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
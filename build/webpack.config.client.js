const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
    entry: {
        app: path.join(__dirname, '../client/app.js')
    },
    output: {
        filename: '[name][hash].js',
        path: path.join(__dirname,'../dist'),
        publicPath: '/public/' // 注释一下，否则测试的时候需要在dist里面在进行一个public的目录
    },
    module: {
        rules: [
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
    config.devServer = {
        host: '0.0.0.0',
        port: '8888',
        contentBase: path.join(__dirname, '../dist'), // 内容的缓存位置
        // host: true, // 进行热加载，现在还没有，所以先不需要
        overlay: {
            errors: true // 报错的时候出现一个悬浮层出现错误
        },
        publicPath: '/public', // 所有的文件都需要在前面加上/public，默认是没有;对应着output-publicPath里的内容
        historyApiFallback: { // 很恶心的一个错误就是因为dist目录已经存在，导致查找js有问题
            index: '/public/index.html' // 所有的404都会进入到index.html
        }

    }
}

module.exports = config
const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
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
};
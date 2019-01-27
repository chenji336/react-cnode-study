const path = require('path')

module.exports = {
    target: 'node', // 表示在node环境里面执行，默认的是web(查看打包的js，node的是module.exports)
    entry: {
        app: path.join(__dirname, '../client/server-entry.js')
    },
    output: {
        filename: 'server-entry.js',
        path: path.join(__dirname,'../dist'),
        publicPath: '/public/', // 注释一下，否则测试的时候需要在dist里面在进行一个public的目录
        libraryTarget: 'commonjs2'
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
};
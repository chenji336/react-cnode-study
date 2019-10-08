const path = require('path')

module.exports = {
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '/public/' // 坑：为啥public后面也要斜杠，因为热更新的js也会使用这个publicPath，如果没有/，则public080999.js,正常应该是public/080999.js，可以打开chrome-network-preserve log进行查看
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        loader: 'eslint-loader',
        enforce: 'pre', // 每次打包前进行检查，如果出现错误则不执行下去
        exclude: [
          path.resolve(__dirname, '../node_modules') // 不检查node_modules
        ]
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/, // 分开写是因为不想要编译node_modules中的js，因为已经编译过一遍了
        loader: 'babel-loader',
        exclude: [
          path.join(__dirname, '../node_modules')
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'] // 默认js可以不写后缀，但是jsx需要编写。使用extensions后就可以不用理会了
  }
}

const axios = require('axios')
const webpack = require('webpack')
const path = require('path')
const MemoryFS = require('memory-fs')
const proxy = require('http-proxy-middleware')
const serverConfig = require('../../build/webpack.config.server')
const serverRender = require('../util/server-render')

// const Module = module.constructor
const NativeModule = require('module') // 本地的module
const vm = require('vm') // 执行代码的环境，理解成eval

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs') // 记得有public，因为做了devServer-historyApiFallback
      .then(res => {
        // 如果使用res.data,那么每次的时候都会加载appxxx.js,会重新渲染一次页面，因此不能直观看到效果
        // const noJsHtml = `
        //       <!DOCTYPE html>
        //       <html lang="en">
        //       <head>
        //           <meta charset="UTF-8">
        //           <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //           <meta http-equiv="X-UA-Compatible" content="ie=edge">
        //           <title>ejs</title>
        //       </head>
        //       <body>
        //           <!-- <div id="root">Webpack App</div> -->
        //           <div id="root"><%- appString %></div>
        //           <script>
        //             window.__INITIAL_STATE_ = <%- initialState %>
        //           </script>
        //       </html>
        // `;
        // resolve(noJsHtml)
        resolve(res.data)
      })
      .catch(reject)
  })
}

const getModuleFromString = (bundle, filename) => {
  const m = {
    exports: {}
  }

  const wrapper = NativeModule.wrap(bundle) // 理解成一个函数
  const script = new vm.Script(wrapper, { // 执行这个函数的环境
    filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m) // 这里的require就是本地的rquire，所以可以使用
  return m
}

const mfs = new MemoryFS()
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs // 操作文件都在缓存中进行，更快；api跟node的fs一样

let serverBundle
serverCompiler.watch({}, (err, stats) => {
  console.log('watch-修改client下的组件会进入我这里')
  if (err) throw err
  stats = stats.toJson() // 需要验证下(当webpack专门的stats文件需要toJSON，记一下)；转成json对象才好执行下面两个步骤
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8') // 转成string,内容：module.exports=xxxxxx(不要漏了utf-8，有些会转成buff)

  // 下面三行代码等价 module.export = serverBundle,然后在require('serverBundle')。为啥不直接用bundle，因为bundle格式是module.exports以及里面很多压缩代码
  // const m = new Module()
  // m._compile(bundle, 'server-entry.js') // 记住给个名称，否则会报错（ The "path" argument must be of type string. Received type undefined）
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports // exort 导出默认，在require中需要.default
  // console.log('serverBundle:', serverBundle) // 出来的是一个对象，需要renderToString解析成string
})

module.exports = function (app) {
  app.use('/public', proxy({ // 对比server.js的public
    target: 'http://localhost:8888'
  }))
  // app.use('/public', express.static(path.join(__dirname, '../dist'))) // express.static找的是本地的
  app.get('*', (req, res, next) => {
    if (!serverBundle) {
      return res.send('waiting for compile, referesh later')
    }
    getTemplate()
      .then(template => {
        return serverRender(serverBundle, template, req, res)
      })
      .catch(next)
  })
}

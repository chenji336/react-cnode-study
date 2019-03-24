const express = require('express')
const ReactSSR = require('react-dom/server')
const path = require('path')
const fs = require('fs')
const favicon = require('serve-favicon')
const app = express();
const isDev = process.env.NODE_ENV === 'development'
// console.log('isDev', isDev)

app.use(favicon(path.resolve(__dirname, '../favicon.ico')))

if (!isDev) {
    const serverEntry = require('../dist/server-entry.js').default // export的是default，require需要.default

    const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8')
    // 没有use('/public')，那么访问的dist/app.js 等价 http://localhost:3333/app.js
    app.use('/public', express.static(path.join(__dirname, '../dist'))) // /public跟webpack中的publicPath相对应

    // 上面的public执行了就不会执行这里的*，也就是说静态文件不会进入这里
    app.get('*', function (req, res) {
        console.log('req.path:', req.path)
        const appString = ReactSSR.renderToString(serverEntry)
        // console.log('appString:', appString)
        res.send(template.replace('<!--app-->', appString))
    })

} else {
    const devStatic = require('./util/dev-static')
    // console.log('devStatic:', devStatic)
    devStatic(app)
}

app.listen(3333, function () {
    console.log('server is listening 3333')
})

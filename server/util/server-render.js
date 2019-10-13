const ReactSSR = require('react-dom/server')
const asyncBootstrap = require('react-async-bootstrapper') // 之前需要.default,现在版本不需要
const ejs = require('ejs')
const Helmet = require('react-helmet').default

const SheetsRegistry = require('react-jss').SheetsRegistry
const create = require('jss').create
const preset = require('jss-preset-default').default
const createMuiTheme = require('@material-ui/core/styles').createMuiTheme
const colors = require('@material-ui/core/colors')
const createGenerateClassName = require('@material-ui/core/styles/createGenerateClassName').default

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    console.log('storeName:', storeName)
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const routerContext = {}
    const createStoreMap = bundle.createStoreMap
    const serverBundle = bundle.default
    const stores = createStoreMap()
    const sheetsRegistry = new SheetsRegistry()
    const jss = create(preset())
    jss.options.createGenerateClassName = createGenerateClassName
    const theme = createMuiTheme({
      palette: {
        primary: colors.pink,
        accent: colors.lightBlue,
        type: 'light',
      },
    })

    const app = serverBundle(stores, routerContext, sheetsRegistry, jss, theme, req.url)
    // mobx-state、state以及方法触发的监听
    asyncBootstrap(app).then(d => {
      // 进行renderToString之后routerContext才会获取到值
      // 主要进行路由跳转，react表现就是redirect
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
        return
      }
      const state = getStoreState(stores) // 把state转成json格式，stores默认的是getter和setter方法
      const appString = ReactSSR.renderToString(app) // 放在外面第一次会出现问题
      const helmet = Helmet.rewind() // 获取组件里面的helmet内容
      // console.log('after-sheetsRegistry:', sheetsRegistry.toString()) // sheetRegistry 在 ReactSSR.renderToString 之后才会有数据
      console.log('stores.appState.count:', stores.appState.count)
      console.log('state:', state)
      console.log('appString:', appString)
      const html = ejs.render(template, {
        appString: appString,
        initialState: JSON.stringify(state), // 如果没有JSON.stringify，那么模板中的就是[Object Object]
        title: helmet.title.toString(),
        meta: helmet.meta.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        materialCss: sheetsRegistry.toString()
      })
      res.send(html)
      resolve()
    }).catch(reject)
  })
}

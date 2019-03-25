import ReactDOM from 'react-dom'
import React from 'react' // 这里没有使用到React为啥要写了，因为所有的jsx都会被编译成React.createElement
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import App from './views/App' // webpack还没有配置，所以需要写后缀jsx

// hydrate 替换 render，这样可以比较客户端和服务端渲染是否有所不同（warn提示16.0以上版本需要）
// 客户端使用hydrate会出现 Expected server HTML to contain a matching <div> in <div>.
// ReactDOM.hydrate(<App />, document.getElementById('root')) // 不建议放在documeng.body上面，会有warn提示的

const root = document.getElementById('root')
const render = (Component) => { // 1.参数需要圆括号 2.ReactDOM.render不需要返回
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter>
        <Component />
      </BrowserRouter>
    </AppContainer>,
    root,
  )
}

render(App);
console.log('module.hot:', module.hot)
// module.hot.accept(); // 简写成这种现在也能成功，不知道是否有副作用
if (module.hot) {
  module.hot.accept('./views/App', () => {
    console.log('accept hot') // 测试是不是进行了监听。答：确实，每次都会执行
    const NextApp = require('./views/App').default // eslint-disable-line
    render(NextApp)
  })
}

import ReactDOM from 'react-dom'
import React from 'react' // 这里没有使用到React为啥要写了，因为所有的jsx都会被编译成React.createElement
import { AppContainer } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import App from './views/App' // webpack还没有配置，所以需要写后缀jsx
import AppState from './store/app-state'

// hydrate 替换 render，这样可以比较客户端和服务端渲染是否有所不同（warn提示16.0以上版本需要）.服务端渲染效率更高
// 客户端使用hydrate会出现 Expected server HTML to contain a matching <div> in <div>.
// ReactDOM.hydrate(<App />, document.getElementById('root')) // 不建议放在documeng.body上面，会有warn提示的

const root = document.getElementById('root')
const initialState = window.__INITIAL_STATE__  || {}// eslint-disable-line
const render = (Component) => { // 1.参数需要圆括号 2.ReactDOM.render不需要返回
  // **AppContainer一定要放在最顶层
  ReactDOM.hydrate(
    <AppContainer>
      {/* new AppState是为了服务端渲染做的，但是这样每次hot时候就会重置appstate内容，看看后续是否有解决方案？ */}
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root,
  )
}

render(App)
console.log('module.hot:', module.hot)
// module.hot.accept(); // 简写成这种现在也能成功，不知道是否有副作用
if (module.hot) {
  module.hot.accept('./views/App', () => {
    console.log('accept hot') // 测试是不是进行了监听。答：确实，每次都会执行
    const NextApp = require('./views/App').default // eslint-disable-line
    render(NextApp)
  })
}

import ReactDOM from 'react-dom'
import React from 'react' // 这里没有使用到React为啥要写了，因为所有的jsx都会被编译成React.createElement
import { AppContainer } from 'react-hot-loader'
import App from './App.jsx' // webpack还没有配置，所以需要写后缀jsx

// hydrate 替换 render，这样可以比较客户端和服务端渲染是否有所不同（warn提示16.0以上版本需要）
// 客户端使用hydrate会出现 Expected server HTML to contain a matching <div> in <div>.
// ReactDOM.hydrate(<App />, document.getElementById('root')) // 不建议放在documeng.body上面，会有warn提示的

const root = document.getElementById('root')
const render = Component => (
    ReactDOM.render(
        <AppContainer>
            <Component></Component>
        </AppContainer>,
        root
    )
)
render(App);
console.log('module.hot:', module.hot)
if (module.hot) {
    module.hot.accept('./App.jsx', () => {
        console.log('accept hot') // 测试是不是进行了监听。答：确实，每次都会执行
        const NextApp = require('./App.jsx').default
        render(NextApp)
    })
}

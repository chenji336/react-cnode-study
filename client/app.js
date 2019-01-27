import ReactDOM from 'react-dom'
import React from 'react' // 这里没有使用到React为啥要写了，因为所有的jsx都会被编译成React.createElement
import App from './App.jsx' // webpack还没有配置，所以需要写后缀jsx

// hydrate 替换 render，这样可以比较客户端和服务端渲染是否有所不同（warn提示16.0以上版本需要）
ReactDOM.hydrate(<App />, document.getElementById('root')) // 不建议放在documeng.body上面，会有warn提示的

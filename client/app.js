import ReactDOM from 'react-dom'
import React from 'react' // 这里没有使用到React为啥要写了，因为所有的jsx都会被编译成React.createElement
import App from './App.jsx' // webpack还没有配置，所以需要写后缀jsx

ReactDOM.render(<App />, document.body) // 不建议放在documeng.body上面，会有warn提示的

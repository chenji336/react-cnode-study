import React from 'react' // 这里没有使用到React为啥要写了，因为所有的jsx都会被编译成React.createElement
import { StaticRouter } from 'react-router-dom' // 专门为服务端渲染设置的router
import { Provider, useStaticRendering } from 'mobx-react' // 提供了服务端渲染的函数
import App from './views/App' // webpack还没有配置，所以需要写后缀jsx
import { createStoreMap } from './store/store'

// reactive框架，在服务端渲染时候一个state的变化会引起重复渲染的bug（比如computed多次执行等）
useStaticRendering(true)


/**
 * stores: mobx有多个store，使用服务端渲染，每次都应该使用新的store，否则渲染会错乱（这个有待考证）
 * routerContext: StaticRouter进行跳转时候需要的上下文信息，比如router进行redirect跳转到那个路由
 * url：现在请求的url
 */
export default (stores, routerContext, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
)

export { createStoreMap }

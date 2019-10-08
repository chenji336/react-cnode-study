import React from 'react'
import {
  inject,
  observer,
} from 'mobx-react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import AppState from '../../store/app-state'

// 使用装饰器和export default时候报错，找了很久原因（回想以下）
@inject('appState') @observer
export default class TopicList extends React.Component {
  static propTypes = { // ~~说明还是有些浏览器不需要使用transofrm-class-property，如果需要在添加上~~
    appState: PropTypes.instanceOf(AppState), // 如果只是PropTypes.object则会报错，使用这种相当于匹配这种类型
  }

  state = {
    x: 1,
  }

  constructor() {
    super()
    this.changeName = this.changeName.bind(this) // 如果没使用箭头函数，需要使用bind方式绑定上下文
  }

  componentDidMount() {
    // do something
    this.test()
    // this.props.appState.count = 3 // 使用mobx这里也是异步改变的
  }

  test = () => { // 只是测试箭头函数是否可用
    // do something
    console.log(1) // 这里还是显示在浏览器中
  }

  // 可以理解成react-async-bootstrapper的生命周期了
  // 命名成bootstrap或则asyncBootstrap都可以,不过推荐是bootstrap
  bootstrap() {
    // 执行优先componentDidMount,服务端先渲染然后在加载相应的appxxx.js
    console.log('asyncStrap1') // 这个log会在服务端显示，浏览器不显示
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3 // 一般不推荐这么修改
        this.setState({ // 这一块服务端渲染还是没有解决的
          x: 2,
        })
        resolve() // 需要返回true，否则不触发react-async-bootstrapper（最新版本的没有发现这个问题）
      }, 1000);
    })
  }

  changeName(event) {
    // this.props.appState.name = event.target.value // 不推荐直接更改，这样就不会有记录了，可以通过action来更改
    this.props.appState.change(event.target.value)
    this.setState({
      x: 2,
    })
    console.log(event.target.value)
  }

  render() {
    const { appState } = this.props
    const { x } = this.state
    return (
      <div>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="this is description" />
        </Helmet>
        <input onChange={this.changeName} />
        <span>{appState.msg}</span>
        <span>{x}</span>
      </div>
    )
  }
}

// 也可以使用 stage-1  transform-class-properties 插件做成class static属性
/* TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState), // 如果只是PropTypes.object则会报错，使用这种相当于匹配这种类型
} */

// 为属性指定默认值,不考虑，在eslint中已经设置 放弃
/* TopicList.defaultProps = {
  appState: {
    count: 1,
    name: 'minxi',
  },
} */

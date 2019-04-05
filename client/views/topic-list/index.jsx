import React from 'react'
import {
  inject,
  observer,
} from 'mobx-react'
import PropTypes from 'prop-types'
import AppState from '../../store/app-state'

// 使用装饰器和export default时候报错，找了很久原因（回想以下）
@inject('appState') @observer
export default class TopicList extends React.Component {
  static propTypes = { // 说明还是有些浏览器不需要使用transofrm-class-property，如果需要在添加上
    appState: PropTypes.instanceOf(AppState), // 如果只是PropTypes.object则会报错，使用这种相当于匹配这种类型
  }

  constructor() {
    super()
    this.changeName = this.changeName.bind(this) // 如果没使用箭头函数，需要使用bind方式绑定上下文
  }

  componentDidMount() {
    // do something
    this.test()
  }

  test = () => { // 只是测试箭头函数是否可用
    // do something
    console.log(11)
  }

  changeName(event) {
    // this.props.appState.name = event.target.value // 不推荐直接更改，这样就不会有记录了，可以通过action来更改
    this.props.appState.change(event.target.value)
  }

  render() {
    const { appState } = this.props
    return (
      <div>
        <input onChange={this.changeName} />
        <span>{appState.msg}</span>
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

import React from 'react'
import {
  inject,
  observer,
} from 'mobx-react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '../layout/container'
import TopicListItem from './list-item'
import { AppState, TopicStore } from '../../store/store'

// 使用装饰器和export default时候报错，找了很久原因（回想以下）
@inject(stores => ({
  appState: stores.appState,
  topicStore: stores.topicStore,
})) @observer
export default class TopicList extends React.Component {
  constructor() {
    super()
    this.state = {
      tabIndex: 0,
    };
    this.changeTab = this.changeTab.bind(this);
    this.listItemClick = this.listItemClick.bind(this);
  }

  componentDidMount() {
    this.props.topicStore.fetchTopics()
  }

  changeTab(e, index) {
    this.setState({
      tabIndex: index,
    })
  }

  /* eslint-disable */
  listItemClick() {

  }
  /* eslint-enable */

  // 可以理解成react-async-bootstrapper的生命周期了
  // 命名成bootstrap或则asyncBootstrap都可以,不过推荐是bootstrap
  bootstrap() {
    // 执行优先componentDidMount,服务端先渲染然后在加载相应的appxxx.js
    console.log('asyncStrap1') // 这个log会在服务端显示，浏览器不显示
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3 // 一般不推荐这么修改；appState是一个对象，所以更改了，传递给服务端也是最新的
        // this.setState({ // 这一块服务端渲染还是没有解决的；state没有传递给服务端，所以这一块没有更新
        //   x: 2,
        // })
        resolve() // 需要返回true，否则不触发react-async-bootstrapper（最新版本的没有发现这个问题）
      }, 1000);
    })
  }

  render() {
    const {
      tabIndex,
    } = this.state;
    const {
      topicStore,
    } = this.props;
    const { syncing: syncingTopics, topics: topicList } = topicStore;

    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="this is description" />
        </Helmet>
        <Tabs value={tabIndex} onChange={this.changeTab}>
          <Tab label="全部" />
          <Tab label="分享" />
          <Tab label="工作" />
          <Tab label="问答" />
          <Tab label="精品" />
          <Tab label="测试" />
        </Tabs>
        <List>
          {
            topicList.map(topic => (
              <TopicListItem onClick={this.listItemClick} topic={topic} key={topic.id} />
            ))
          }
        </List>
        {
          syncingTopics ? (
            <div>
              <CircularProgress color="secondary" size={100} />
            </div>
          ) : null
        }
      </Container>
    )
  }
}

// 也可以使用 stage-1  transform-class-properties 插件做成class static属性
TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired, // 如果只是PropTypes.object则会报错，使用这种相当于匹配这种类型
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
}

// 为属性指定默认值,不考虑，在eslint中已经设置 放弃
/* TopicList.defaultProps = {
  appState: {
    count: 1,
    name: 'minxi',
  },
} */

import React from 'react'
import {
  inject,
  observer,
} from 'mobx-react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import queryString from 'query-string'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress'
import Container from '../layout/container'
import TopicListItem from './list-item'
import { AppState, TopicStore } from '../../store/store'
import { tabs } from '../../utils/variable-define'

// 使用装饰器和export default时候报错，找了很久原因（回想以下）
@inject(stores => ({
  appState: stores.appState,
  topicStore: stores.topicStore,
})) @observer
export default class TopicList extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super()
    this.changeTab = this.changeTab.bind(this);
    this.listItemClick = this.listItemClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // 路由参数改变，不会进入到 componentDidMount，所以需要 componentWillReceiveProps 执行fetchTopics
    if (this.props.location.search !== nextProps.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
    }
  }

  componentDidMount() {
    const tab = this.getTab()
    this.props.topicStore.fetchTopics(tab)
  }

  getTab(search) {
    search = search || this.props.location.search
    const query = queryString.parse(search)
    return query.tab || 'all'
  }

  changeTab(e, value) {
    console.log('changeTab:', value)
    // this.context.router.history.push({
    //   pathname: '/index',
    //   search: `?tab=${value}`,
    // })

    this.props.history.push({ // 建议直接使用 props.history
      pathname: '/index',
      search: `?tab=${value}`,
    })
  }

  listItemClick(topic) {
    this.props.history.push(`/detail/${topic.id}`)
  }

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
      topicStore,
    } = this.props;
    const { syncing: syncingTopics, topics: topicList } = topicStore;

    return (
      <Container>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="this is description" />
        </Helmet>
        <Tabs value={this.getTab()} onChange={this.changeTab}>
          {
            Object.keys(tabs).map(tabName => (
              <Tab label={tabs[tabName]} value={tabName} key={tabName} />
            ))
          }
        </Tabs>
        <List>
          {
            topicList.map(topic => (
              <TopicListItem onClick={() => this.listItemClick(topic)} topic={topic} key={topic.id} />
            ))
          }
        </List>
        {
          syncingTopics ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '40px 0',
              }}
            >
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

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object,
}

// 为属性指定默认值,不考虑，在eslint中已经设置 放弃
/* TopicList.defaultProps = {
  appState: {
    count: 1,
    name: 'minxi',
  },
} */

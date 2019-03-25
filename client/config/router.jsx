import React from 'react'
import {
  Route,
  Redirect,
} from 'react-router-dom'

import TopicList from '../views/topic-list'
import TopicDetail from '../views/topic-detail'

// 如果没有
export default () => [
  <Route
    path="/"
    render={
      () => <Redirect to="list" /> // 遇到 / 会进行跳转到 list
    }
    exact
    key="first"
  />,
  <Route path="/list" exact component={TopicList} key="list" />,
  <Route path="/detail" exact component={TopicDetail} key="detail" />,
]

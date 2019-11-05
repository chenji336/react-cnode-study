import React from 'react'
import {
  Route,
  Redirect,
} from 'react-router-dom'

import TopicList from '../views/topic-list'
import TopicDetail from '../views/topic-detail'
import TestApi from '../views/test/api-test'
import UserLogin from '../views/user/login'
import UserInfo from '../views/user/info'

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
  <Route path="/index" exact component={TopicList} key="index" />,
  <Route path="/list" exact component={TopicList} key="list" />,
  <Route path="/detail/:id" exact component={TopicDetail} key="detail" />,
  <Route path="/user/login" exact component={UserLogin} key="login" />,
  <Route path="/user/info" exact component={UserInfo} key="info" />,
  <Route path="/test" exact component={TestApi} key="test" />,
]

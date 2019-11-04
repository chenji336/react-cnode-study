import React from 'react'
import AppBar from './layout/app-bar'
import Routes from '../config/router'

export default class App extends React.Component {
  componentDidMount() {
    // do something
  }

  render() {
    return [
      <AppBar key="appbar" />,
      <Routes key="routes" />,
    ]
  }
}

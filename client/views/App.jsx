import React from 'react'
import { Link } from 'react-router-dom'
import Routes from '../config/router'

export default class App extends React.Component {
  componentDidMount() {
    // do something
  }

  render() {
    return [
      <div key="banner">
        <Link to="list">list</Link>
        <br />
        <Link to="detail">detail</Link>
      </div>,
      <Routes key="routes" />,
    ]
  }
}

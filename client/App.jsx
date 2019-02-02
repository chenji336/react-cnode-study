import React from 'react'

export default class App extends React.Component {
  constructor() {
    super()
    console.log('是否hot了')
    this.state = {
      test: 1,
    }
  }

  render() {
    const { test } = this.state
    return (
      <div onClick={() => this.setState({ test: 2 })}>
        112hello world!
        {test}
      </div>
    )
  }
}

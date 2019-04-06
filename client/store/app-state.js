import {
  observable,
  computed,
  action,
} from 'mobx'

// 服务端渲染需要在外面每次都创建新的实例，所以这里直接返回class（之前版本是返回实例的）
export default class AppState {
  constructor({ name, count } = { name: 'chenji', count: 0 }) {
    this.name = name
    this.count = count
  }

  @observable count

  @observable name

  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }

  @action add() {
    this.count += 1
  }

  @action change(name) {
    this.name = name
  }

  // 服务端渲染使用
  toJson() {
    return {
      name: this.name,
      count: this.count,
    }
  }
}

export const appState = new AppState() // 留着对比测试：不每次新建的情况下热更新

import {
  observable,
  computed,
  action,
} from 'mobx'

// 服务端渲染需要在外面每次都创建新的实例，所以这里直接返回class（之前版本是返回实例的）
export default class AppState {
  @observable count = 0

  @observable name = 'chenji'

  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }

  @action add() {
    this.count += 1
  }

  @action change(name) {
    this.name = name
  }
}

export const appState = new AppState() // 留着对比测试：不每次新建的情况下热更新

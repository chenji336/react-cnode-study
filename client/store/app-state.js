import {
  observable,
  computed,
  action,
  autorun,
} from 'mobx'

export class AppState {
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

const appState = new AppState()

setInterval(() => {
  appState.add()
}, 1000)

autorun(() => {
  // console.log(`${appState.name} say count is ${appState.count}`)
})

export default appState

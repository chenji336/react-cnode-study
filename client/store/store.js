import AppStateClass, { appState } from './app-state'

const AppState = AppStateClass

export default {
  AppState,
}

export const createStoreMap = () => ({
  // appState: new AppState(),
  appState,
})

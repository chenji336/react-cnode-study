import {
  observable,
  action,
} from 'mobx';

import { get, post } from '../utils/http';

export default class AppState {
  @observable user = {
    isLogin: false,
    info: {},
    detail: {
      recentTopics: [],
      recentReplies: [],
      syncing: false,
    },
    collections: {
      list: [],
      syncing: false,
    },
  }

  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post('user/login', {}, {
        accessToken,
      }).then((resp) => {
        if (resp.success) {
          this.user.isLogin = true;
          this.user.info = resp.data;
          resolve();
        } else {
          reject(resp);
        }
      }).catch(reject)
    })
  }

  @action getUserDetail() {
    this.user.detail.syncing = true;
    return new Promise((resolve, reject) => {
      get(`user/${this.user.info.loginname}`)
        .then((resp) => {
          if (resp.success) {
            this.user.detail.recentReplies = resp.data.recent_replies;
            this.user.detail.recentTopics = resp.data.recent_topics;
            resolve()
          } else {
            reject()
          }
          this.user.detail.syncing = false;
        })
        .catch((err) => {
          reject(err);
          this.user.detail.syncing = false;
        })
    })
  }

  @action getUserCollection() {
    this.user.collections.syncing = true;
    return new Promise((resolve, reject) => {
      get(`topic_collect/${this.user.info.loginname}`).then((resp) => {
        if (resp.success) {
          this.user.collections.list = resp.data;
          resolve();
        } else {
          reject();
        }
        this.user.collections.syncing = false;
      }).catch((err) => {
        reject(err);
        this.user.collections.syncing = true;
      })
    })
  }
}

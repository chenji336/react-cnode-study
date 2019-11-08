import {
  observable,
  action,
  computed,
  extendObservable,
} from 'mobx';
import {
  get,
  post,
} from '../utils/http';
import { topicSchema } from '../utils/variable-define';

const createTopic = topic => Object.assign({}, topicSchema, topic);

class Topic {
  @observable syncing = false;

  constructor(data) {
    extendObservable(this, data); // react/status/mobx
  }
}

export default class TopicStore {
  @observable topics;

  @observable details;

  @observable syncing;

  constructor({
    topics,
    syncing,
    details,
  } = {
    topics: [],
    syncing: false,
    details: [],
  }) {
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
    this.syncing = syncing;
    this.details = details.map(detail => new Topic(createTopic(detail)));
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)));
  }

  @computed get detailMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail
      return result
    }, {})
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      this.syncing = true;
      this.topics = [];
      get('topics', {
        mrender: false,
        tab,
      }).then((resp) => {
        if (resp.success) {
          resp.data.forEach((topic) => {
            this.addTopic(topic);
          })
          resolve();
        } else {
          reject();
        }
      }).catch(reject)
        .finally(() => {
          this.syncing = false;
        })
    })
  }

  @action getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      if (this.detailMap[id]) {
        resolve(this.detailMap[id])
      } else {
        get(`/topic/${id}`, {
          mrender: false,
        }).then((resp) => {
          if (resp.success) {
            const topic = new Topic(createTopic(resp.data));
            this.details.push(topic);
            resolve(topic);
          } else {
            reject()
          }
        }).catch(reject)
      }
    })
  }

  // update 2019-03-21: 涉及发帖和发评论的接口都已经下线了，太多人为了测试客户端乱发帖了。
  @action createTopic(title, tab, content) {
    return new Promise((resolve, reject) => {
      post('topics', {
        needAccessToken: true,
      }, {
        title,
        tab,
        content,
      }).then((resp) => {
        if (resp.success) {
          const topic = {
            title,
            tab,
            content,
            id: resp.topic_id,
            create_at: Date.now(),
          };
          this.createdTopics.push(new Topic(createTopic(topic)));
          resolve()
        } else {
          reject()
        }
      }).catch(reject)
    })
  }
}

import {
  observable,
  action,
  computed,
  extendObservable,
} from 'mobx';
import {
  get,
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
}

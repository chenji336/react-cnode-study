import {
  observable,
  action,
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

  @observable syncing;

  constructor({
    topics,
    syncing,
  } = {
    topics: [],
    syncing: false,
  }) {
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
    this.syncing = syncing;
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)));
  }

  @action fetchTopics() {
    return new Promise((resolve, reject) => {
      this.syncing = true;
      this.topics = [];
      get('topics', {
        mrender: false,
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
}

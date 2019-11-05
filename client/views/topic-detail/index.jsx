import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet'
import marked from 'marked';
import dateFormat from 'dateformat'
import {
  inject,
  observer,
} from 'mobx-react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

import Container from '../layout/container';
import Reply from './reply';
import { topicDetailStyle } from './styles';

@inject(stores => ({ appState: stores.appState, topicStore: stores.topicStore })) @observer
class TopicDetail extends React.Component {
  componentDidMount() {
    // do something
    const id = this.getTopicId();
    this.props.topicStore.getTopicDetail(id);
  }

  getTopicId() {
    return this.props.match.params.id;
  }

  render() {
    const { classes } = this.props;
    const id = this.getTopicId();
    const topic = this.props.topicStore.detailMap[id];
    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress color="secondary" />
          </section>
        </Container>
      )
    }
    return (
      <div>
        <Container>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }}></p>
          </section>
        </Container>
        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} 回复`}</span>
            <span>{`最新回复 ${dateFormat(topic.last_reply_at, 'yyyy-mm-dd')}`}</span>
          </header>
          <section>
            {
              topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)
            }
          </section>
        </Paper>
      </div>
    )
  }
}

TopicDetail.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  topicStore: PropTypes.object.isRequired,
}

export default withStyles(topicDetailStyle)(TopicDetail);

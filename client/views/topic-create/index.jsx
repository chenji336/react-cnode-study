import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button'
import IconReply from '@material-ui/icons/Reply';
import Snackbar from '@material-ui/core/Snackbar';
import SimpleMDE from 'react-simplemde-editor';

import topicCreateStyles from './styles';
import Container from '../layout/container';
import { tabs } from '../../utils/variable-define';

@inject(stores => ({ topicStore: stores.topicStore })) @observer
class TopicCreate extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      title: '',
      newReply: 'ddddd',
      tab: 'dev',
      open: false,
      message: '',
    }
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleTitleChange(e) {
    this.setState({
      title: e.target.value.trim(),
    })
  }

  handleContentChange(value) {
    this.setState({
      newReply: value,
    })
  }

  handleTabChange(e) {
    this.setState({
      tab: e.currentTarget.value,
    })
  }

  handleCreate() {
    const { title, newReply, tab } = this.state;
    if (!title) {
      return this.showMessage('标题不能为空');
    }
    if (!newReply) {
      return this.showMessage('内容不能为空');
    }
    return this.props.topicStore.createTopic(title, tab, newReply)
      .then(() => {
        this.context.router.history.push('/index');
      })
      .catch((err) => {
        this.showMessage(err.message);
      })
  }

  handleClose() {
    this.setState({
      open: false,
    })
  }

  showMessage(message) {
    this.setState({
      open: true,
      message,
    })
  }

  render() {
    const { classes } = this.props;
    const { message, open } = this.state;
    return (
      <Container>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          message={message}
          open={open}
          onClose={this.handleClose}
        />
        <div className={classes.root}>
          <TextField
            className={classes.title}
            label="标题"
            value={this.state.title}
            onChange={this.handleTitleChange}
            fullWidth
          />
          <SimpleMDE
            onChange={this.handleContentChange}
            value={this.state.newReply}
            options={{
              toolbar: false,
              spellchecker: false,
              placeholder: '发表精彩内容',
              autofocus: true,
            }}
          />
          <div>
            {
              Object.keys(tabs).map((tab) => {
                if (tab !== 'all' && tab !== 'good') {
                  return (
                    <span className={classes.selectItem} key={tab}>
                      <Radio
                        value={tab}
                        checked={tab === this.state.tab}
                        onChange={this.handleTabChange}
                      />
                      {tabs[tab]}
                    </span>
                  )
                }
                return null
              })
            }
          </div>
          <Button fab="true" color="primary" onClick={this.handleCreate} className={classes.replyButton}>
            <IconReply />
          </Button>
        </div>
      </Container>
    )
  }
}

TopicCreate.propTypes = {
  classes: PropTypes.object.isRequired,
}

TopicCreate.wrappedComponent.propTypes = {
  topicStore: PropTypes.object.isRequired,
}

export default withStyles(topicCreateStyles)(TopicCreate);

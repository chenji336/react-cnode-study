import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react'

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import UserWrapper from './user';
import loginStyle from './styles/login-style';

@inject(stores => ({ appState: stores.appState, user: stores.appState.user })) @observer
class UserLogin extends React.Component {
  // static contextTypes = {
  //   router: PropTypes.object,
  // }

  constructor() {
    super();
    this.state = {
      accesstoken: '',
      helpText: '',
    }
    this.handleInput = this.handleInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentWillMount() {
    console.log('this.props:', this.props)
    if (this.props.user.isLogin) {
      this.props.history.replace('/user/info'); // 老的是 this.context.router.history.replace('/user/info')
    }
  }

  handleInput(e) {
    this.setState({
      accesstoken: e.target.value.trim(),
    })
  }

  handleLogin() {
    if (!this.state.accesstoken) {
      return this.setState({
        helpText: '必须填写',
      })
    }
    this.setState({
      helpText: '',
    });
    return this.props.appState.login(this.state.accesstoken)
      .then(() => {
        this.props.history.replace('/user/info');
      })
      .catch((err) => {
        console.log(err); // eslint-disable-line
      })
  }

  render() {
    const { classes } = this.props;
    const { helpText, accesstoken } = this.state;
    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label="请输入Cnode AccessToken"
            placeholder="请输入Cnode AccessToken"
            required
            helperText={helpText}
            value={accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button raised="true" color="secondary" onClick={this.handleLogin} className={classes.loginButton}>登录</Button>
        </div>
      </UserWrapper>
    )
  }
}

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
}

UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
}

export default withStyles(loginStyle)(UserLogin);

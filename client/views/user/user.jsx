import React from 'react';
import { PropTypes } from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';

import Avatar from '@material-ui/core/Avatar';
import UserIcon from '@material-ui/icons/AccountCircle'
import { withStyles } from '@material-ui/core';

import Container from '../layout/container';
import userStyle from './styles/user-style';

@inject(stores => ({ user: stores.appState.user })) @observer
class User extends React.Component {
  componentDidMount() {
    // ...
  }

  render() {
    const { classes, user } = this.props;
    const { info } = user;
    return (
      <Container>
        <div className={classes.avatar}>
          <div className={classes.bg}></div>
          {
            info.avatar_url
              ? <Avatar className={classes.avatarImg} src={info.avatar_url} />
              : <Avatar className={classes.avatarImg}><UserIcon /></Avatar>
          }
          <span className={classes.userName}>{info.loginname || '未登录'}</span>
        </div>
        {this.props.children}
      </Container>
    )
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
}

User.propTypes = {
  user: PropTypes.object.isRequired,
}

export default withStyles(userStyle)(User);

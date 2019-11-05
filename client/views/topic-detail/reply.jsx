import React from 'react';
import marked from 'marked';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

import { replyStyle } from './styles';

const Reply = ({ reply, classes }) => (
  <div className={classes.root}>
    <div className={classes.left}>
      <Avatar src={reply.author.avatar_url} />
    </div>
    <div className={classes.right}>
      <span>{`${reply.author.loginname}   ${dateFormat(reply.create_at, 'yyyy-mm-dd')}`}</span>
      <p dangerouslySetInnerHTML={{ __html: marked(reply.content) }}></p>
    </div>
  </div>
)

Reply.propTypes = {
  reply: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
}

export default withStyles(replyStyle)(Reply);

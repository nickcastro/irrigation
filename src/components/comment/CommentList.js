import React, { Component } from 'react';
import Comment from './Comment';
import style from './style';
import AuthService from '../utils/AuthService'

class FieldList extends Component {

  componentDidMount(){
    console.log("CommentList mounted");
    console.log(AuthService.getProfile().email);
  }

  render() {
    let commentNodes = this.props.data.map(comment => {
      return (
        <Comment
          author={ comment.author }
          uniqueID={ comment['_id'] }
          onCommentDelete={ this.props.onCommentDelete }
          onCommentUpdate={ this.props.onCommentUpdate }
          key={ comment['_id'] }>
          { comment.text }
        </Comment>
      )
    })
    return (
      <div style={ style.commentList }>
        { commentNodes }
      </div>
    )
  }
}

export default FieldList;
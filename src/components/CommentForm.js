//CommentForm.js
import React, { Component } from 'react';
import style from './style';

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = { FieldName: '', text: '' };
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleAuthorChange(e) {
    this.setState({ FieldName: e.target.value });
  }
  handleTextChange(e) {
    this.setState({ text: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    let FieldName = this.state.FieldName.trim();
    let text = this.state.text.trim();
    if (!text || !FieldName) {
      return;
    }
    this.props.onCommentSubmit({ FieldName: FieldName, text: text });
    this.setState({ FieldName: '', text: '' });
  }
  render() {
    return (
      <form style={ style.commentForm } onSubmit={ this.handleSubmit }>
        <input
          type='text'
          placeholder='Your name...'
          style={ style.commentFormAuthor}
          value={ this.state.FieldName }
          onChange={ this.handleAuthorChange } />
        <input
          type='text'
          placeholder='Say something...'
          style={ style.commentFormText}
          value={ this.state.text }
          onChange={ this.handleTextChange } />
        <input
          type='submit'
          style={ style.commentFormPost }
          value='Post'/>
      </form>
    )
  }
}

export default CommentForm;
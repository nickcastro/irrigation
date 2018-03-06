import React, { Component } from 'react';
import Field from './Field';
import style from './style';
import AuthService from '../utils/AuthService'

class FieldList extends Component {

  componentDidMount(){
    console.log("CommentList mounted");
    console.log(AuthService.getProfile().email);
  }

  filterByUser(field) {
  return field.uid === AuthService.getProfile().user_id;
  }

  render() {

  //console.log(this.props);

  var newFields = this.props.data.filter(this.filterByUser);
  //console.log(newFields);

    var fieldNodes = newFields.map((field, index) => {

      return (

        <Field

          FieldName={ field.FieldName }
          CropName={ field.crop }
          Field={field}
          url={this.props.url}
          uniqueID={ field['_id'] }
          onFieldDelete={ this.props.onFieldDelete }
          onFieldUpdate={ this.props.onFieldUpdate }
          key={ index }
          setActiveField={this.props.setActiveField}
          activeField={this.props.activeField}
          urlMakeInactive={this.props.urlMakeInactive}
          >

        </Field>

      )

    })

    return (
      <div style={ style.commentList }>
        { fieldNodes }
      </div>
    )
  }
}

export default FieldList;
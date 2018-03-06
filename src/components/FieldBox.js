
import React, { Component } from 'react';
import axios from 'axios';
import FieldList from './FieldList';
import CommentForm from './CommentForm';
import style from './style';

import AuthService from '../utils/AuthService'

// used to calculate initial irrigaiton vector
import Kc from '../calculations/Kc.js';

import FieldEditForm from './FieldEditForm'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class FieldBox extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.loadFieldsFromServer = this.loadFieldsFromServer.bind(this);
    this.handleFieldSubmit = this.handleFieldSubmit.bind(this);
    this.handleFieldDelete = this.handleFieldDelete.bind(this);
    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
  }
  loadFieldsFromServer() {
    axios.get(this.props.url)
      .then(res => {
        this.setState({ data: res.data });
      })
  }
  handleFieldSubmit(field) {

    let fields = this.state.data;
    field.id = Date.now();
    let newFields = fields.concat([field]);
    this.setState({ data: newFields });

    let uid = AuthService.getProfile().user_id;

    var Kc_vals = Kc(field.crop, field.plantDate);

    var irrigationAmount = [];
    var irrigationDate = [];

    for(var i = 0; i < Kc_vals.Date.length; i++){
      irrigationAmount[i] = 0;
      irrigationDate[i] = Kc_vals.Date[i];
    }

    var irrigationArray = {Date: irrigationDate, Amount: irrigationAmount};

    console.log(irrigationArray);

    field.irrigation = irrigationArray;

    // get currently active field (if exists) and make inactive  
    
    //console.log("newFields length");
    //console.log(newFields.length);

    
    axios.get(`${this.props.urlMakeInactive}/${uid}`)
      .then(res => {
        //console.log(res.data);
        if(res.data.length != 0){
          axios.put(`${this.props.urlMakeInactive}/${uid}`)
            .catch(err => {
              console.log(err);
          });
        }
      });
    
    // add to /fields
    axios.post(this.props.url, field)
      .catch(err => {
        console.error(err);
        this.setState({ data: fields });
      });

      this.props.setActiveField(field);
  }

  handleFieldDelete(id) {
    console.log(id);
    //console.log(this.props.url);
    //console.log(`${this.props.url}/${id}`);
    axios.delete(`${this.props.url}/${id}`)
      .then(res => {
        console.log('Comment deleted');
      })
      .catch(err => {
        console.log("here");
        console.error(err);
      });
  }
  handleFieldUpdate(id, field) {

    console.log(field);

    //sends the comment id and new author/text to our api
    axios.put(`${this.props.url}/${id}`, field)
      .catch(err => {
        console.log(err);
      })
  }
  componentDidMount() {
    this.loadFieldsFromServer();
    setInterval(this.loadFieldsFromServer, this.props.pollInterval);
    this.props.runAfterLoggedIn();
    //this.props.fieldsLoaded();
  }
  render() {
    //console.log(this.state.data);
    return (
      <div style={ style.commentBox }>
      <MuiThemeProvider>
        <FieldList
          onFieldDelete={ this.handleFieldDelete }
          onFieldUpdate={ this.handleFieldUpdate }
          data={ this.state.data }
          url={this.props.url}
          setActiveField={this.props.setActiveField}
          activeField={this.props.activeField}
          urlMakeInactive = {this.props.urlMakeInactive}
          fieldsLoaded={this.props.fieldsLoaded}
          />
      </MuiThemeProvider>
      <MuiThemeProvider>
        <FieldEditForm edit={false} weatherData={this.props.weatherData} onFieldSubmit={ this.handleFieldSubmit } showFieldEditForm={this.props.showFieldEditForm} closeFieldEditForm={()=>{this.props.closeFieldEditForm()}}  />
      </MuiThemeProvider>
      </div>
    )
  }
}

export default FieldBox;

import React, { Component } from 'react';
import axios from 'axios';
import IrrigationList from './IrrigationList';
import IrrEditForm from './IrrEditForm'
import style from './style';

import AuthService from '../../utils/AuthService'

// used to calculate initial irrigaiton vector
import Kc from '../../calculations/Kc.js';

//import FieldEditForm from './FieldEditForm'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class IrrigationBox extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.loadFieldFromServer = this.loadFieldFromServer.bind(this);
    this.handleIrrSubmit = this.handleIrrSubmit.bind(this);
    this.handleIrrDelete = this.handleIrrDelete.bind(this);
    this.handleIrrUpdate = this.handleIrrUpdate.bind(this);
  }
  loadFieldFromServer() {
    let uid = AuthService.getProfile().user_id;

    //set state with currently active field
    axios.get(`${this.props.urlActive}/${uid}`)
      .then(res => {
        if(res.data.length != 0){
          this.setState({ data: res.data[0].irrigation });
        }
        //console.log(res.data.length);
    });
  }
  handleIrrSubmit(irrigation) {

    console.log(irrigation);
    let uid = AuthService.getProfile().user_id;
    console.log("submit irrigation");

    if(this.props.activeField.length != 0){

    var field = this.props.activeField[0];
    for(var i = 0; i < field.irrigation.Date.length; i++){
            if(field.irrigation.Date[i] == irrigation.Date){
              field.irrigation.Amount[i] = irrigation.Amount;
              console.log("irrigation date found");
            }
          }

        var id = field._id;

      // update field with new irrigation values
        axios.put(`${this.props.url}/${id}`, field)
          .catch(err => {
          console.error(err);
          //this.setState({ data: fields });
        });

    this.props.setActiveField(field);
  }

    /*axios.get(`${this.props.urlActive}/${uid}`)
      .then(res => {
        console.log(res.data);
        var field = res.data[0];
        //console.log(field[0].irrigation);
        //find currently active field, add irrigation to field
        for(var i = 0; i < field.irrigation.Date.length; i++){
            if(field.irrigation.Date[i] == irrigation.Date){
              field.irrigation.Amount[i] = irrigation.Amount;
              console.log("irrigation date found");
            }
          }

        var id = field._id;

        console.log(field);
        
        // update field with new irrigation values
        axios.put(`${this.props.url}/${id}`, field)
          .catch(err => {
          console.error(err);
          //this.setState({ data: fields });
        });

          this.props.setActiveField(field);

    });*/

  }

  handleIrrDelete(date) {
    
    let uid = AuthService.getProfile().user_id;

    var field = this.props.activeField[0];

    //console.log(this.props);

    /*axios.get(`${this.props.urlActive}/${uid}`)
      .then(res => {
        console.log(res.data);
        var field = res.data[0];
        //console.log(field[0].irrigation);
        //find currently active field, add irrigation to field
        for(var i = 0; i < field.irrigation.Date.length; i++){
            if(field.irrigation.Date[i] == date){
              field.irrigation.Amount[i] = 0;
              //console.log("irrigation date found");
            }
          }*/

        var field = this.props.activeField[0];

        for(var i = 0; i < field.irrigation.Date.length; i++){
            if(field.irrigation.Date[i] == date){
              field.irrigation.Amount[i] = 0;
              //console.log("irrigation date found");
            }
          }  

        var id = field._id;

        //console.log(field);
        
        // update field with new irrigation values
        axios.put(`${this.props.url}/${id}`, field)
          .catch(err => {
          console.error(err);
          //this.setState({ data: fields });
        });

          this.props.setActiveField(field);

    //});
  }
  handleIrrUpdate(irrigation) {
    let uid = AuthService.getProfile().user_id;

    var field = this.props.activeField[0];

    //console.log(this.props);

    /*axios.get(`${this.props.urlActive}/${uid}`)
      .then(res => {
        console.log(res.data);
        var field = res.data[0];
        //console.log(field[0].irrigation);
        //find currently active field, add irrigation to field
        for(var i = 0; i < field.irrigation.Date.length; i++){
            if(field.irrigation.Date[i] == irrigation.Date){
              field.irrigation.Amount[i] = irrigation.Amount;
              //console.log("irrigation date found");
            }
          }*/

        for(var i = 0; i < field.irrigation.Date.length; i++){
            if(field.irrigation.Date[i] == irrigation.Date){
              field.irrigation.Amount[i] = irrigation.Amount;
              //console.log("irrigation date found");
            }
          }

        var id = field._id;

        //console.log(field);
        
        // update field with new irrigation values
        axios.put(`${this.props.url}/${id}`, field)
          .catch(err => {
          console.error(err);
          //this.setState({ data: fields });
        });

          this.props.setActiveField(field);

    //});
  }
  componentDidMount() {
    this.loadFieldFromServer();
    setInterval(this.loadFieldFromServer, this.props.pollInterval);
    this.props.runAfterLoggedIn();
  }
  render() {

    //console.log(this.props);

    return (
      <div style={ style.commentBox }>
      <MuiThemeProvider>
        <IrrigationList
          onIrrDelete={ this.handleIrrDelete }
          onIrrUpdate={ this.handleIrrUpdate }
          data={ this.state.data }
          activeField={this.props.activeField}
          irrigation={this.props.irrigation}
          url={this.props.url}
          urlActive={this.props.urlActive}
          />
      </MuiThemeProvider>
      <MuiThemeProvider>
        <IrrEditForm urlActive={this.props.urlActive} edit={false} onIrrSubmit={ this.handleIrrSubmit } showIrrEditForm={this.props.showIrrEditForm} closeIrrEditForm={()=>{this.props.closeIrrEditForm()}}  />
      </MuiThemeProvider>
      </div>
    )
  }
}

export default IrrigationBox;
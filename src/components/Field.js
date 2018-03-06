import React, { Component } from 'react';
import style from './style';
import marked from 'marked';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton';
import { MoreVert } from 'material-ui-icons';
import axios from 'axios';
import AuthService from '../utils/AuthService'

//used to calculate new irrigation array length on field plantDate change
import Kc from '../calculations/Kc.js';

import './fieldStyle.css'


import FieldEditForm from './FieldEditForm'


class Field extends Component {
  constructor(props) {
    super(props);
    this.state= {
      toBeUpdated: false,
      FieldName: ''
    };
    //binding all our functions to this class
    this.deleteField = this.deleteField.bind(this);
    this.updateField = this.updateField.bind(this);
    
    this.handleFieldUpdate = this.handleFieldUpdate.bind(this);
  }

  updateField() {
    //e.preventDefault();
    //brings up the update field when we click on the update link.
    this.setState({ toBeUpdated: !this.state.toBeUpdated });
  }

  closeFieldEditForm(){
    this.setState({
      toBeUpdated: !this.state.toBeUpdated,
      FieldName: ''
    })
  }

  handleFieldUpdate(field) {

    let id = this.props.uniqueID;
    console.log(field);
    console.log("handleUpdate");
    console.log("current active field:");
    //console.log(field);
    console.log(this.props.activeField[0]);
    //console.log(this.props.activeField[0]._id);


    axios.get(`${this.props.url}/${id}`)
      .then(res => {
        console.log(res.data);

        var irrigation = res.data.irrigation;

        
        var TimeStamp = "T00:00:00";
        var newDate = new Date(field.plantDate + TimeStamp);
        var existingDate = new Date(res.data.plantDate + TimeStamp);

        // if array should be updated
        if(newDate.getTime() != existingDate.getTime()){
          //update irrigation array

          console.log("plantDate should be updated");

          // save existing irrigation events
          var irrEvents = [];
          var count = 0;
          for(var i = 0; i < irrigation.Date.length; i++){
            if(irrigation.Amount[i] > 0){
              irrEvents[count] = {Date: irrigation.Date[i], Amount: irrigation.Amount[i]};
              count++;
            }
          }

          console.log(irrEvents);
          //console.log(irrEvents[0].Date);

          var noEvents = false;

          if(count == 0){
            noEvents = true;
          }

            var Kc_vals = Kc(field.crop, field.plantDate);
            var irrigationAmount = [];
            var irrigationDate = [];
            var newCount = 0;
            for(i = 0; i < Kc_vals.Date.length; i++){
            
              if(noEvents != true){

                console.log(i);
                console.log(newCount);
                console.log(irrEvents);
                console.log(irrEvents.length);

                if(newCount == irrEvents.length){
                  newCount--;
                }

                var date = new Date(Kc_vals.Date[i] + TimeStamp);
                var irrDate = new Date(irrEvents[newCount].Date + TimeStamp);
            
                if(date.getTime() == irrDate.getTime()){
                  irrigationAmount[i] = irrEvents[newCount].Amount;
                  newCount++;
                } else{
                  irrigationAmount[i] = 0;
                }
              }else{
                irrigationAmount[i] = 0;
              }

              irrigationDate[i] = Kc_vals.Date[i];
            }// end for

            irrigation = {Date: irrigationDate, Amount: irrigationAmount};
            console.log(irrigation);
          
        } // end if array should be updated
        

        // iterate irrigation to find irrigation events
        // push to array
        // create updatedIrrigation array
        // if dates match, update amount
        // field.irrigation = updatedIrrigation.

        field.irrigation = irrigation;

        this.props.onFieldUpdate(id, field);

        // if this.props.isActive
        if(this.props.Field.isActive == true){
          this.props.setActiveField(field);
        }

      });

  }

  deleteField() {
    let id = this.props.uniqueID;
    this.props.onFieldDelete(id);
    console.log('deleteField() called');
  }

  makeActive(field){

    console.log("make active called.");
    console.log(field);

    let uid = AuthService.getProfile().user_id;
    

    // if user has an active field, make it inactive
    // else do nothing
    
    axios.get(`${this.props.urlMakeInactive}/${uid}`)
      .then(res => {
        console.log("searching for active field..");
        console.log(res.data.length);
        if(res.data.length != 0){
          if(res.data[0]._id != field._id){
          console.log("active field found for this user:");
          console.log(res.data);
            //console.log("testing");
            //console.log(testing);
          axios.put(`${this.props.urlMakeInactive}/${uid}`)
            .catch(err => {
              console.log(err);
            });
          }
        }
    });

    let id = this.props.uniqueID;
    field.isActive = true;

    //update db
    this.props.onFieldUpdate(id, field);

    // set state to new active field
    this.props.setActiveField(field);

  }

  render() {
    return (
      <div style={ style.field }>

        <div style={{flex: '1'}} onClick={ ()=>{this.makeActive(this.props.Field)} }>
        <p style={ style.title }>{this.props.FieldName}<br/><span style={ style.cropName }>{this.props.CropName}</span></p>
      {/*<p style={ this.props.Field.isActive ? style.cropName : style.hidden }>{this.props.Field.location}<br/><span style={ this.props.Field.isActive ? style.cropName : style.hidden }>{this.props.Field.soil}</span></p>*/}
        </div>

<IconMenu 
  style={{alignSelf: 'center'}}
  iconButtonElement={<IconButton><MoreVert /></IconButton>}
  targetOrigin={{horizontal: 'right', vertical: 'top'}}
  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
>
    <MenuItem primaryText="Edit" onTouchTap={() => {
          this.updateField()
        }} />
    <MenuItem primaryText="Delete" onTouchTap={() => {
          this.deleteField()
        }} />
</IconMenu>

<FieldEditForm edit={true} Field={this.props.Field} onFieldSubmit={ this.handleFieldUpdate } showFieldEditForm={this.state.toBeUpdated} closeFieldEditForm={()=>{this.closeFieldEditForm()}}  />
    

    </div>
    )
  }
}

export default Field;
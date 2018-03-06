import React, { Component } from 'react';
import style from './style';
import marked from 'marked';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton';
import { MoreVert } from 'material-ui-icons';
import axios from 'axios';

import IrrEditForm from './IrrEditForm'

import AuthService from '../../utils/AuthService';

import './fieldStyle.css';


class Irrigation extends Component {
  constructor(props) {
    super(props);
    this.state= {
      toBeUpdated: false,
      FieldName: ''
    };
    //binding all our functions to this class
    this.deleteIrr = this.deleteIrr.bind(this);
    this.updateIrr = this.updateIrr.bind(this);
    
    this.handleIrrUpdate = this.handleIrrUpdate.bind(this);
  }

  updateIrr() {
    //e.preventDefault();
    //brings up the update field when we click on the update link.
    this.setState({ toBeUpdated: !this.state.toBeUpdated });
  }

  closeIrrEditForm(){
    this.setState({
      toBeUpdated: !this.state.toBeUpdated,
      FieldName: ''
    })
  }

  handleIrrUpdate(irrigation) {

    console.log("update");

    /*let id = this.props.uniqueID;
    console.log(field);
    console.log("handleUpdate");
    console.log("current active field:");
    //console.log(field);
    console.log(this.props.activeField[0]);
    //console.log(this.props.activeField[0]._id);*/

    this.props.onIrrUpdate(irrigation);

    /*// if this.props.isActive
    if(this.props.Field.isActive == true){
      this.props.setActiveField(field);
    }*/

  }

  deleteIrr() {
    //console.log("delete");
    let date = this.props.IrrDate;
    this.props.onIrrDelete(date);
    //console.log('deleteField() called');
  }

  render() {
    return (
      <div style={ style.field }>

        <div style={{flex: '1'}} >
        <p style={ style.title }>{this.props.IrrDate}<br/><span style={style.amount}>{this.props.Amount} in</span></p>
        </div>

<IconMenu 
  style={{alignSelf: 'center'}}
  iconButtonElement={<IconButton><MoreVert /></IconButton>}
  targetOrigin={{horizontal: 'right', vertical: 'top'}}
  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
>
    <MenuItem primaryText="Edit" onTouchTap={() => {
          this.updateIrr()
        }} />
    <MenuItem primaryText="Delete" onTouchTap={() => {
          this.deleteIrr()
        }} />
</IconMenu>

<IrrEditForm Field={this.props.Field} editAmount={this.props.Amount} editDate={this.props.IrrDate} urlActive={this.props.urlActive} edit={true} onIrrSubmit={ this.handleIrrUpdate } showIrrEditForm={this.state.toBeUpdated} closeIrrEditForm={()=>{this.closeIrrEditForm()}}  />


    </div>
    )
  }
}

export default Irrigation;
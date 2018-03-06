import React, { Component } from 'react';
import Irrigation from './Irrigation';
import style from './style';
import axios from 'axios';
import AuthService from '../../utils/AuthService'

var _ = require('lodash');

class IrrigationList extends Component {

  componentDidMount(){
    console.log("IrrigationList mounted");
    console.log(AuthService.getProfile().email);
  }

  filterByUser(field) {
  return field.uid === AuthService.getProfile().user_id;
  }

  componentDidUpdate(){
    //console.log("IrrigationList Updated");
    //console.log(this.props);
  }

  render() {

    //console.log(this.props);

    //console.log(Amount);
    //console.log(Dates);

    var irrNodes = [];
    var count = 0;

  /*if(this.props.data.length != 0){
    var Amount = this.props.data.Amount;
    var Dates = this.props.data.Date;
    for(var i = 0; i < Amount.length; i++){
      if(Amount[i] > 0){
        irrNodes[count] = {Amount: Amount[i], Date: Dates[i]};
        count++;
      }
    }
  }*/

  var Amount = this.props.activeField[0].irrigation.Amount;
    var Dates = this.props.activeField[0].irrigation.Date;
    for(var i = 0; i < Amount.length; i++){
      if(Amount[i] > 0){
        irrNodes[count] = {Amount: Amount[i], Date: Dates[i]};
        count++;
      }
    }

  var newNodes = irrNodes.map( (irrEvent, index ) => {
    return(
           <Irrigation
            IrrDate={irrEvent.Date}
            Amount={irrEvent.Amount}
            url={this.props.url}
            urlActive={this.props.urlActive}
            Field={this.props.activeField[0]}
            onIrrDelete={ this.props.onIrrDelete }
            onIrrUpdate={ this.props.onIrrUpdate }
            key={ index }
            >
        </Irrigation>
        );
  })


  //console.log(newNodes);


    return (
      <div style={ style.commentList }>
      {newNodes}
      </div>
    )
  }
}

export default IrrigationList;
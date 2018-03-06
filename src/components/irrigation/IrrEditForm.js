import React, { Component } from 'react';

// import material ui components
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import axios from 'axios';
import AuthService from '../../utils/AuthService';

class IrrEditForm extends Component {

  constructor(props) {
    super(props);
    if(this.props.edit){
    //console.log(this.props.Field.plantDate);
    //console.log(this.props.Field.irrigation);

    var TimeStamp = "T00:00:00";
    var setDate = new Date(this.props.editDate + TimeStamp);

    //var setDate = new Date(this.props.editDate);
    //setDate = new Date(setDate.getTime());
  }
    this.state = {
      amount: (this.props.edit)?(this.props.editAmount):"",
      irrDate: (this.props.edit)?(setDate):new Date,
      amountError: "",
      irrDateError: "",
    };
  }
/*
    componentWillReceiveProps(nextProps) {
      if(nextProps.edit){
         this.setState({
          FieldName: nextProps.Field.FieldName,
          location: nextProps.Field.location,
          plantDate: new Date(nextProps.Field.plantDate),
          crop: nextProps.Field.crop,
          soil: nextProps.Field.soil,
        });
     }
    }*/

    submitHandler() {
      console.log("submit irrigation called");
      console.log(this.state);

      let amount = this.state.amount;
      let irrDate = this.state.irrDate;
      let newIrrDate = irrDate.toISOString().slice(0, 10);

      //console.log(amount);
      //console.log(newIrrDate);

      if (!amount || !irrDate) {
        //console.log("set error message in stage here depending on incorrect field..");
        if(!amount)
          this.setState({ amountError: 'This field is required'});
        if(amount)
          this.setState({ amountError: ''});
        if(!irrDate)
          this.setState({ irrDateError: 'This field is required'});
        if(irrDate)
          this.setState({ irrDateError: ''});
        return;
      }

      var irrigation = {Date: newIrrDate, Amount: amount};

      let uid = AuthService.getProfile().user_id;

    //set state with currently active field
    axios.get(`${this.props.urlActive}/${uid}`)
      .then(res => {
        if(res.data.length != 0){
          this.props.onIrrSubmit(irrigation);
        } else {
          alert("Add a field before adding irrigation events.");
        }
        //console.log(res.data.length);
    });

      newIrrDate = new Date(newIrrDate);
      newIrrDate = new Date(newIrrDate.getTime() + 86400000);

      if(this.props.edit){
        this.setState({ amount: amount, irrDate: newIrrDate});
      } else{
        this.setState({ amount: '', irrDate: new Date});
      }
      

      this.props.closeIrrEditForm();
    }

  handleAmountChange = (event, index, value) => this.setState({amount: value});
  handleIrrDateChange = (event, date) => this.setState({irrDate: date});

    render() {

    const items = [];
    for(var i = 0; i < 10; i++ ) {
      items.push(<MenuItem value={i} key={i} primaryText={`${i} inches`} />);
    }

      const actions = [
        <FlatButton
          label="Cancel"
          secondary={true}
          onTouchTap={()=>{this.props.closeIrrEditForm()}}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          onTouchTap={()=>{this.submitHandler()}}
        />,
      ];

        return ( 
      <Dialog
          title="Add Irrigation Event"
          modal={false}
          actions={actions}
          contentStyle={styles.dialog}
          open={this.props.showIrrEditForm}
          onRequestClose={()=>{this.props.closeIrrEditForm()}}
        >
        
        <SelectField
          ref="amount"
          value={this.state.amount}
          onChange={this.handleAmountChange}
          floatingLabelText="Amount (in)"
          errorText={this.state.amountError}
          style={{width: '100%'}}
          maxHeight={200}
        >
        {items}
        </SelectField>

        <DatePicker 
          onChange={this.handleIrrDateChange}
          value={new Date(this.state.irrDate)}
          style={styles.fieldItem} 
          errorText={this.state.irrDateError}
          textFieldStyle={{width: '100%'}} 
          floatingLabelText="Irrigation Event Date" />

      </Dialog>
        );
    }
}

const styles={
  dialog: {
  width: '400px',
  maxWidth: 'none',
  },
  fieldItem:{
    width:'100%',
  }
};


export default IrrEditForm;

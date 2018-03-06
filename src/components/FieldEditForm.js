import React, { Component } from 'react';

// import material ui components
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AuthService from '../utils/AuthService'

//Import JSON files 
import StationList from './json/StationList.json'
import KcTable from './json/KcTable.json'
import Soils from './json/Soils.json'

class FieldEditForm extends Component {

  constructor(props) {
    super(props);
    if(this.props.edit){
    //console.log(this.props.Field.plantDate);
    var setDate = new Date(this.props.Field.plantDate);
    setDate = new Date(setDate.getTime() + 86400000);
  }
    this.state = {
      FieldName: (this.props.edit)?(this.props.Field.FieldName):"",
      location: (this.props.edit)?(this.props.Field.location):"",
      plantDate: (this.props.edit)?(setDate):new Date,
      crop: (this.props.edit)?(this.props.Field.crop):"",
      soil: (this.props.edit)?(this.props.Field.soil):"",
      FieldNameError: "",
      locationError: "",
      plantDateError: "",
      cropError: "",
      soilError: "",
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
      console.log("submit called");

        //e.preventDefault();

        //var field = {
            //name: this.refs.fieldName.getValue()
            //plantDate: this.refs.plantDate.getValue()
            //rowSpacing: ReactDOM.findDOMNode(this.refs.rowSpacing).value,
            //emitterSpacing: ReactDOM.findDOMNode(this.refs.emitterSpacing).value,
            //emitterFlow: ReactDOM.findDOMNode(this.refs.emitterFlow).value
        //};

      console.log(this.state);
    
      let uid = AuthService.getProfile().user_id;
      let FieldName = this.state.FieldName.trim();
      let crop = this.state.crop.trim();
      let location = this.state.location.trim();
      let soil = this.state.soil.trim();
      let plantDate = this.state.plantDate;

      var TimeStamp = "T00:00:00";

      //console.log("plant Date");
      //console.log(plantDate);
      var weatherStart = new Date(this.props.weatherData[0].the_date + TimeStamp);
      var today = new Date();

      let newPlantDate = plantDate.toISOString().slice(0, 10);
      var tmpPlantDate = new Date(newPlantDate + TimeStamp);
      console.log(weatherStart.getTime());
      console.log(tmpPlantDate.getTime());
      console.log(today.getTime());
      //console.log(newPlantDate);

      //console.log(plantDate);
      //let text = this.state.text.trim();
      if (!FieldName || !location || !crop || !soil || !plantDate) {
        //console.log("set error message in stage here depending on incorrect field..");
        if(!FieldName)
          this.setState({ FieldNameError: 'This field is required'});
        if(FieldName)
          this.setState({ FieldNameError: ''});
        if(!location)
          this.setState({ locationError: 'This field is required'});
        if(location)
          this.setState({ locationError: ''});
        if(!crop)
          this.setState({ cropError: 'This field is required'});
        if(crop)
          this.setState({ cropError: ''});
        if(!soil)
          this.setState({ soilError: 'This field is required'});
        if(soil)
          this.setState({ soilError: ''});
        if(!plantDate)
          this.setState({ plantDateError: 'This field is required'});
        if(plantDate){
                    if(tmpPlantDate.getTime() < weatherStart.getTime() || tmpPlantDate.getTime() > today.getTime()){
            this.setState({ plantDateError: 'Plant date is outside allowable range'});
          }
          else{
            this.setState({ plantDateError: ''});
        }
          
        }
        return;
      }
      this.props.onFieldSubmit({ 
        uid: uid,
        FieldName: FieldName, 
        crop: crop,
        location: location,
        soil: soil,
        plantDate: newPlantDate });

      // dates adding one day when converting to and from strings
      // hence the following:
      newPlantDate = new Date(newPlantDate);
      newPlantDate = new Date(newPlantDate.getTime() + 86400000);

      if(this.props.edit){
        this.setState({ FieldName: FieldName, location: location, crop: crop, soil: soil, plantDate: newPlantDate});
      } else{
        this.setState({ FieldName: '', location: '', crop: '', soil: '', plantDate: new Date});
      }
/*
        var editData = this.props.editData;
        if (editData) {
            this.props.updateRecipe(crop, editData.index);
        }
        else {
            this.props.addRecipe(crop);
        }
*/
        this.props.closeFieldEditForm();
        //this.forceUpdate();
        //console.log(this.props);
    }

  handleNameChange = (event, index, value) => this.setState({FieldName: event.target.value});
  handleLocationChange = (event, index, value) => this.setState({location: value});
  handleCropChange = (event, index, value) => this.setState({crop: value});
  handleSoilChange = (event, index, value) => this.setState({soil: value});
  handlePlantDateChange = (event, date) => this.setState({plantDate: date});

    render() {

      const actions = [
        <FlatButton
          label="Cancel"
          secondary={true}
          onTouchTap={()=>{this.props.closeFieldEditForm()}}
        />,
        <FlatButton
          label="Submit"
          primary={true}
          onTouchTap={()=>{this.submitHandler()}}
        />,
      ];

        return ( 
      <Dialog
          title="Add New Field"
          modal={false}
          actions={actions}
          contentStyle={styles.dialog}
          open={this.props.showFieldEditForm}
          onRequestClose={()=>{this.props.closeFieldEditForm()}}
        >
        
        <TextField 
          style={styles.fieldItem} 
          onChange={this.handleNameChange} 
          floatingLabelText="Field Name"
          errorText={this.state.FieldNameError}
          defaultValue={this.state.FieldName}  />
        
        <SelectField
          ref="location"
          value={this.state.location}
          onChange={this.handleLocationChange}
          floatingLabelText="Location"
          errorText={this.state.locationError}
          style={{width: '100%'}}
          maxHeight={200}
        >
          {StationList.map((item, index) =>
            <MenuItem key={index} value={item.City} primaryText={item.City} />
          )}
        </SelectField>

        <SelectField
          ref="crop"
          value={this.state.crop}
          onChange={this.handleCropChange}
          floatingLabelText="Crop"
          errorText={this.state.cropError}
          style={{width: '100%'}}
          maxHeight={200}
        >
          {KcTable.map((item, index) =>
            <MenuItem key={index} value={item.Crop} primaryText={item.Crop} />
          )}
        </SelectField>

        <SelectField
          ref="soil"
          value={this.state.soil}
          onChange={this.handleSoilChange}
          errorText={this.state.soilError}
          floatingLabelText="Soil Texture"
          style={{width: '100%'}}
          maxHeight={200}
        >
          {Soils.map((item, index) =>
            <MenuItem key={index} value={item.Texture} primaryText={item.Texture} />
          )}
        </SelectField>

        <DatePicker 
          onChange={this.handlePlantDateChange}
          value={new Date(this.state.plantDate)}
          style={styles.fieldItem} 
          errorText={this.state.plantDateError}
          textFieldStyle={{width: '100%'}} 
          floatingLabelText="Plant Date" />

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


export default FieldEditForm;

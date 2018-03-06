import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class AddFieldButton extends React.Component {

componentDidMount(){
  	console.log("Add Field Button Mounted.");
  }

 
render() {
    return (
    <MuiThemeProvider>
       <FlatButton 
        label="Add Field" 
        primary={true} 
        fullWidth={true}
        onTouchTap={() => this.props.openFieldEditForm()}
        style={{height:'48px'}}
        icon={<FontIcon className="material-icons">add_circle_outline</FontIcon>}
       >

       </FlatButton>
    </MuiThemeProvider>
    );
  }

}



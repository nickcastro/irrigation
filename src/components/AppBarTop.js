// @flow

import React from 'react';
import AuthService from '../utils/AuthService';
//import { Route } from 'react-router-dom'
import { Redirect } from 'react-router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { withStyles, createStyleSheet } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import FlatButton from 'material-ui/FlatButton';
import Typography from 'material-ui/styles/typography';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton';
import { ExpandMore, MoreVert } from 'material-ui-icons';
import ToolbarGroup from 'material-ui/Toolbar'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


class AppBarTop extends React.Component {

  handleclick(){
      console.log("logout");
      AuthService.logout();  
      <Redirect push to="/login"/>
  }

  render() {

    const styles = {
      right:{
        //float:right,
      }
    };

    const MyNavLinks = () => (
  <ToolbarGroup style={{backgroundColor: "#F5F5F5"}}>
    <p>{user.nickname}</p>
                <IconMenu
        iconButtonElement={
          <IconButton><ExpandMore /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Sign out" onTouchTap={() => {this.handleclick() }} />
      </IconMenu>
  </ToolbarGroup> 
);

    console.log(AuthService.getProfile());
    var user = AuthService.getProfile();
    return (
    <MuiThemeProvider>
      <div>

      <AppBar 
      //color="#333" 
      title="Smart Irrigation"
      titleStyle={{color: "#333"}}
      style={{backgroundColor: "#F5F5F5"}}
      //style={{backgroundColor: '#2196F3'}}
      showMenuIconButton={false}
      iconElementRight={<MyNavLinks />}
    >

    </AppBar>
      
      </div>
    </MuiThemeProvider>
    );
  }
}

export default AppBarTop;

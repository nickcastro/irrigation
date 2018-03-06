import React from 'react'
import PropTypes from 'prop-types'
//import { Link } from 'react-router-dom'

import AuthService from '../../utils/AuthService'
import './Header.css'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import { withStyles, createStyleSheet } from 'material-ui/styles/colors';
import AppBar from 'material-ui/AppBar';
//import Toolbar from 'material-ui/Toolbar';
//import FlatButton from 'material-ui/FlatButton';
//import Typography from 'material-ui/styles/typography';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton';
import { ExpandMore, Opacity } from 'material-ui-icons';
import ToolbarGroup from 'material-ui/Toolbar';

import dropIcon from './images/drop.png';

const Header = ({ authService, history, isAuthenticated, profile, error, loginRequest, logoutSuccess }) =>

<MuiThemeProvider>
      <div>

      <AppBar 
      //color="#333" 
      title="Smart Irrigation"
      titleStyle={{color: "#f9f9f9"}}
      //style={{backgroundColor: "#F5F5F5"}}
      //style={{backgroundColor: '#2196F3', zIndex: '500'}}
      style={{backgroundColor: '#3A4958', zIndex: '500'}}
      showMenuIconButton={true}
      iconElementLeft={<IconButton><Opacity /></IconButton>}
      iconElementRight={  <ToolbarGroup style={{backgroundColor: "#3A4958"}}>
    <p style={{margin: "15px 0px", color:"#f9f9f9"}}>{profile.email}</p>
    <IconMenu
        iconButtonElement={
          <IconButton iconStyle={{fill: '#f9f9f9'}}><ExpandMore /></IconButton>
        }
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Sign out" onTouchTap={() => {
            logoutSuccess()
            AuthService.logout() // careful, this is a static method
            history.push({ pathname: '/login' })
        }} />
      </IconMenu>
  </ToolbarGroup> }
    >

    </AppBar>
      
      </div>
    
</MuiThemeProvider>

  

Header.propTypes = {
  authService: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  profile: PropTypes.object,
  error: PropTypes.string,
  loginRequest: PropTypes.func.isRequired,
  logoutSuccess: PropTypes.func.isRequired
}

export default Header

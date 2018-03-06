import React from 'react'
//import ReactCSSTransitionGroup from 'react-addons-css-transition-group'; // ES6
import Auth0Lock from 'auth0-lock'
//import jwtDecode from 'jwt-decode'
import config from '../../utils/config'
import LogoImg from '../../utils/images/orange.png'

import './login.css'


export default class LoginPage extends React.Component {


componentDidMount(){
  	console.log("login Mounted");
    //this.props.history.push({ pathname: '/login' });

  	//document.getElementsByTagName("body")[0].style.backgroundColor='#f9f9f9';
  	document.getElementsByTagName("body")[0].style.backgroundImage = 'url(image/crop_bg.jpg)';
  	document.getElementsByTagName("body")[0].style.backgroundRepeat = 'no-repeat';
  	document.getElementsByTagName("body")[0].style.backgroundSize = 'cover';
  	document.getElementsByTagName("body")[0].style.backgroundPosition = 'center';
  	document.getElementsByTagName("body")[0].style.backgroundAttachment = 'fixed';
  	
  	    // Configure Auth0 lock
    var lock = new Auth0Lock(config.AUTH0_CLIENT_ID, config.AUTH0_DOMAIN, {
      auth: {
        redirectUrl: 'http://localhost:3000/callback',
        responseType: 'token'
      },
       theme: {
         logo: LogoImg,
         primaryColor: "#b81b1c"
       },
      languageDictionary: {
        title: 'Smart Irrigation'
      },
      container: 'login-container',
      rememberLastLogin: false
    });

    lock.show();

    /*setTimeout(() => {
            this.fadeIn();
        }, 1000);*/
  }

  fadeIn() {
    document.getElementById("login-container").style.opacity = 1;
}

render() {
	var windowHeight = window.innerHeight;
	var newMargin = (windowHeight-498)/2;
	var style={
  	opacity: 1,
  	transition: '0.8s',
  	marginTop: newMargin,
	};
    return(
    <div>
    	<div style={style} id='login-container'></div>
  	</div>
    )
  }

}


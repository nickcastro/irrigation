import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import { Redirect } from 'react-router'

import axios from 'axios';

//import AppBarTop from '../../components/AppBarTop'
import Col from 'react-bootstrap/lib/Col';
import HeaderContainer from '../Header/HeaderContainer'
import '../../components/HomePage/HomePage.css';
import MainContent from '../../components/MainContent'
//import HomePage from '../../components/HomePage/HomePage'
//import AboutPage from '../../components/AboutPage/AboutPage'
import LoginPage from '../../components/LoginPage/LoginPage'
import NotFoundPage from '../../components/NotFoundPage/NotFoundPage'
import AuthService from '../../utils/AuthService'
import AddFieldButton from '../../components/AddFieldButton'
import FieldBox from '../../components/FieldBox';

import AddIrrButton from '../../components/irrigation/AddIrrButton'
import IrrigationBox from '../../components/irrigation/IrrigationBox';

import RenderIf from '../../components/RenderIf';
import Kc from '../../calculations/Kc.js';

//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


class App extends React.Component {

   constructor(props) {
      super(props);
      var Kc_vals = Kc("Corn", "2017-03-20");
      var irrigationAmount = [];
      var irrigationDate = [];

    for(var i = 0; i < Kc_vals.Date.length; i++){
      irrigationAmount[i] = 0;
      irrigationDate[i] = Kc_vals.Date[i];
    }

    var irrigationArray = {Date: irrigationDate, Amount: irrigationAmount};

      this.state = {
          activeField: [],
          editIndex: -1,
          showFieldEditForm: false,
          showIrrEditForm: false,
          fieldsLoaded: false,
          urlActive:'http://localhost:3001/api/fields/active',
          urlWeather:'http://localhost:3001/api/weather',
          weatherData: [],
      };
      this.loadActiveFieldFromServer = this.loadActiveFieldFromServer.bind(this);
      this.loadWeatherDataFromServer = this.loadWeatherDataFromServer.bind(this);

  }

  authService = new AuthService()

  componentWillMount() {
    // Add callback for lock's `authenticated` event
    this.authService.lock.on('authenticated', (authResult) => {
      this.authService.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error)
          return this.props.loginError(error)
        AuthService.setToken(authResult.idToken) // static method
        AuthService.setProfile(profile) // static method
        this.props.loginSuccess(profile)
        return this.props.history.push({ pathname: '/' })
      })
    })
    console.log(AuthService.loggedIn());
    // Add callback for lock's `authorization_error` event
    this.authService.lock.on('authorization_error', (error) => {
      this.props.loginError(error)
      return this.props.history.push({ pathname: '/' })
    })

  }

  componentDidMount(){
    console.log("appView mounted, logged in?");
    console.log(AuthService.loggedIn());
    if(!AuthService.loggedIn()){
      //return this.props.history.push({ pathname: '/login' })
    } else {
      //console.log("loading active field");
      this.loadActiveFieldFromServer(AuthService.getProfile().user_id);
    }
  }

  componentDidUpdate(){
    console.log("updated");
    console.log(AuthService.loggedIn());
  }

  componentWillUpdate(){
    console.log("will update");
    console.log(AuthService.loggedIn());
  }

  sendToLogin(){
    //return this.props.history.push({ pathname: '/login' });
  }

  runAfterLoggedIn(){
    //console.log("Should definitely be logged in:");
    //console.log(AuthService.loggedIn());
    if(!AuthService.loggedIn()){
      //return this.props.history.push({ pathname: '/login' })
    } else {
      //console.log("loading active field");
      this.loadActiveFieldFromServer(AuthService.getProfile().user_id);
    }
  }


  loadActiveFieldFromServer(id) {
    axios.get(`${this.state.urlActive}/${id}`)
      .then(res => {
        console.log(res);
        //if active field exists in database, set current state
        if(res.data.length != 0){
          this.setState({
            activeField: res.data
          });
          //if active field exists for user, load respective weather data
          //console.log("should load weather for city");
          //console.log(res.data[0].location);
          this.loadWeatherDataFromServer(res.data[0].location);
        } else{

        }
      })
      //retrieve and filter weather data here, set state
  }

  loadWeatherDataFromServer(city) {
    axios.get(`${this.state.urlWeather}/${city}`)
      .then(res => {
        //console.log(res.data);
        this.setState({
          weatherData: res.data
        });
      })
      //retrieve and filter weather data here, set state
  }

  updateBackground(){
    //console.log("User Logged In. updateBackground().");
    document.getElementsByTagName("body")[0].style.background = '#fff';
    document.getElementsByTagName("body")[0].style.margin = '0px';
  }

  openFieldEditForm() {
    //console.log("edit form to be opened");
      this.setState({
          showFieldEditForm: true
      });
  }

  closeFieldEditForm() {
      this.setState({
          showFieldEditForm: false,
          editIndex: -1
      });
  }

    openIrrEditForm() {
    //console.log("edit form to be opened");
      this.setState({
          showIrrEditForm: true
      });
  }

  closeIrrEditForm() {
      this.setState({
          showIrrEditForm: false
      });
  }

  fieldsLoaded() {
    //console.log("edit form to be opened");
      this.setState({
          fieldsLoaded: true
      });
  }

    setActiveField(field) {
    //console.log("edit form to be opened");
    var newField = [];
    newField[0] = field;
      this.setState({
          activeField: newField
      });
      this.loadWeatherDataFromServer(field.location);
      //console.log(this.state.activefield);
      // new active field, set state for updated weather data
  }

  render() {
    return(
      <div>

      {console.log("app view render logged in ?")}
      {console.log(AuthService.loggedIn())}
      {console.log("active field:")}
      {console.log(this.state.activeField)}
      {console.log(this.props)}

        {
          AuthService.loggedIn() ? (
            <div>
              {/*<AppBarTop authService={this.authService} />*/}
              <HeaderContainer authService={this.authService} />
              {this.updateBackground()}
              <Col sm={2} className="leftCol">
                <AddFieldButton openFieldEditForm={this.openFieldEditForm.bind(this)}/>
                <FieldBox
                  runAfterLoggedIn={this.runAfterLoggedIn.bind(this)}
                  url='http://localhost:3001/api/fields'
                  urlMakeInactive = 'http://localhost:3001/api/fields/active'
                  pollInterval={500}
                  showFieldEditForm={this.state.showFieldEditForm} 
                  closeFieldEditForm={this.closeFieldEditForm.bind(this)}
                  setActiveField={this.setActiveField.bind(this)}
                  activeField={this.state.activeField}
                  fieldsLoaded={this.fieldsLoaded.bind(this)}
                  weatherData={this.state.weatherData}
                   />
                   
  
              </Col>
              <Col sm={8}>
              {RenderIf(this.state.activeField.length != 0,
                <MainContent activeField={this.state.activeField} weatherData={this.state.weatherData} />
                )}
              </Col>
              <Col sm={2} className="rightCol">

              {RenderIf(this.state.activeField.length != 0,
              <AddIrrButton openIrrEditForm={this.openIrrEditForm.bind(this)} />

              )}
              {RenderIf(this.state.activeField.length != 0,
              <IrrigationBox 
                  showIrrEditForm={this.state.showIrrEditForm}
                  closeIrrEditForm={this.closeIrrEditForm.bind(this)}
                  activeField={this.state.activefield}
                  urlActive={this.state.urlActive}
                  url='http://localhost:3001/api/fields'
                  pollInterval={500}
                  runAfterLoggedIn={this.runAfterLoggedIn.bind(this)}
                  activeField={this.state.activeField}
                  setActiveField={this.setActiveField.bind(this)}
                />)}

              </Col>
            </div>
            ) : (

            <LoginPage history={this.props.history}/>
            //<Switch>
            //<Route path="/login" component={LoginPage} />
            //<Redirect to="/login" push />
            //</Switch>
            )
          }

          {/*<Route exact path="/" component={HomePage} />
          {console.log(AuthService.loggedIn())}
          <Route path="/login" component={LoginPage} />
          <Route path="/about" component={AboutPage} />
          <Route component={NotFoundPage}/>*/}


      </div>
    )
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  loginSuccess: PropTypes.func.isRequired,
  loginError: PropTypes.func.isRequired
}

export default App

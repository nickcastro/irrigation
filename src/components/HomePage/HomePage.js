import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import './HomePage.css';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export default class HomePage extends React.Component {

componentDidMount(){
  	console.log("homepage Mounted");
  	document.getElementsByTagName("body")[0].style.background = '#fff';
  	document.getElementsByTagName("body")[0].style.margin = '0px';
  }

 
render() {
    return (
      <div>

       <Col sm={2} className="leftCol">
       <MuiThemeProvider>
       <FlatButton 
       	label="Add Field" 
       	primary={true} 
       	style={{width:'100%'}}
       	icon={<FontIcon className="material-icons">add_circle_outline</FontIcon>}
       >

       </FlatButton>
       </MuiThemeProvider>
       </Col>
       <Col sm={10}>
       <MuiThemeProvider>
       <Tabs inkBarStyle={{background: '#f2f2f2'}} tabItemContainerStyle={{background:'#fff'}} >
        <Tab label="Plot" value="a" style={styles.heading}>
          <div>
            <h2 style={styles.headline}>Primary Plot Here</h2>
            <p>
            	X days until crop is stressed.
            </p>
          </div>
        </Tab>
        <Tab label="Extra" value="b" style={styles.heading}>
          <div>
            <h2 style={styles.headline}>Additional Plots/Tables</h2>
            <p>
            	plots and tables here
            </p>
          </div>
        </Tab>
      </Tabs>
      </MuiThemeProvider>

       </Col>
       

      </div>
    );
  }

}

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  heading:{
  	color: '#333',
  }
};


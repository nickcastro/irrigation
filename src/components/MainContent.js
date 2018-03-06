import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// import graphs
import MainPlot from './graphs/MainPlot';
import KcPlot from './graphs/KcPlot';
import EToPlot from './graphs/EToPlot';
import ETsumPlot from './graphs/ETsumPlot';
import ETPlot from './graphs/ETPlot';
import YieldPlot from './graphs/YieldPlot';
import DistributionPlot from './graphs/DistributionPlot';
import DistributionTable from './DistributionTable';
import PrecipPlot from './graphs/PrecipPlot';
import DistributionSumPlot from './graphs/DistributionSumPlot';
import RainDeficitPlot from './graphs/RainDeficitPlot';

// import primary gauges
import StressGauge from './StressGauge';
import YieldGauge from './YieldGauge';
import WaterUseGauge from './WaterUseGauge';

// import calculations
import ETo from '../calculations/ETo.js';
import Kc from '../calculations/Kc.js';
import ETcp from '../calculations/ETcp.js';
import AvailableWater from '../calculations/AvailableWater.js';
import WaterDeficit_p from '../calculations/WaterDeficit_p.js';
import Ks from '../calculations/Ks.js';
import ETca from '../calculations/ETca.js';
import WaterDeficit_a from '../calculations/WaterDeficit_a.js';
import Kcb from '../calculations/Kcb.js';
import Ke from '../calculations/Ke.js';
import ETc_final from '../calculations/ETc_final.js';
import WaterDeficit_final from '../calculations/WaterDeficit_final.js';
import DaysUntilStressed from '../calculations/DaysUntilStress.js';

export default class MainContent extends React.Component {

  constructor(props) {
    super(props);
    //this.state = { kc: [] };
  }

componentDidMount(){
  	console.log("Main Content Mounted.");
    //console.log(this.props.activeField);
    //console.log(this.props.weatherData);
  }

componentDidUpdate(){
  console.log("main content updated");
  console.log(this.props.activeField[0]);
  console.log(this.props.weatherData.length);
  //console.log(ETo(this.props.weatherData));
  //Kc(this.props.activeField[0].crop, this.props.activeField[0].plantDate);
}
 
render() {
  
  // initial conditions for active field
  var crop = this.props.activeField[0].crop;
  var soil = this.props.activeField[0].soil;
  var plantDate = this.props.activeField[0].plantDate;
  var irrigation = this.props.activeField[0].irrigation;
  var weather = this.props.weatherData;

  console.log(this.props);

  // perform calculations based on weather data, and field inputs of active field
  var Kc_vals = Kc(crop, plantDate);
  var ETo_vals = ETo(weather);
  var ETcp_vals = ETcp(ETo_vals, Kc_vals, plantDate);
  var AvailableWater_vals = AvailableWater(crop, soil, Kc_vals);
  var WaterDeficit_p_vals = WaterDeficit_p(irrigation, Kc_vals, ETcp_vals, AvailableWater_vals, weather, plantDate);
  var Ks_vals = Ks(WaterDeficit_p_vals, AvailableWater_vals, Kc_vals, ETcp_vals);
  var ETca_vals = ETca(Ks_vals, ETcp_vals);
  var WaterDeficit_a_vals = WaterDeficit_a(irrigation, Kc_vals, ETcp_vals, ETca_vals, AvailableWater_vals, weather, plantDate);
  var Kcb_vals = Kcb(weather, crop, plantDate);
  var Ke_vals = Ke(irrigation, weather, ETo_vals, ETca_vals, crop, soil, plantDate, Kcb_vals, WaterDeficit_a_vals, AvailableWater_vals);
  //var ETc_final_vals = ETc_final(ETo_vals, Ke_vals, plantDate);
  var WaterDeficit_final_vals = WaterDeficit_final(irrigation, Kc_vals, ETcp_vals, Ke_vals, AvailableWater_vals, weather, plantDate);
  //var Days2Stress = DaysUntilStressed(WaterDeficit_final_vals);

    return (
    <MuiThemeProvider>
       <Tabs inkBarStyle={{background: '#f2f2f2'}} tabItemContainerStyle={{background:'#fff', width: '300px'}} >
        <Tab label="Plot" value="a" style={styles.heading}>
          <div>
            <div style={styles.activeFieldInfo}>
              <p style={styles.activeFieldItemHead}>{this.props.activeField[0].FieldName}</p>
              <p style={styles.activeFieldItem}><span style={styles.itemHeading}>Crop</span><br/>{this.props.activeField[0].crop}</p>
              <p style={styles.activeFieldItem}><span style={styles.itemHeading}>Location</span><br/>{this.props.activeField[0].location}</p>
              <p style={styles.activeFieldItem}><span style={styles.itemHeading}>Soil</span><br/>{this.props.activeField[0].soil}</p>
              <p style={styles.activeFieldItem}><span style={styles.itemHeading}>Plant Date</span><br/>{this.props.activeField[0].plantDate}</p>
            </div>

            <div style={styles.stressedBox}>
              <div style={styles.stressedItem}>
                <p style={styles.stressedText}>Water Remaining in Soil (%)</p>
                <StressGauge style={{ marginTop: '-25px'}} waterDeficit_f={WaterDeficit_final_vals} availableWater={AvailableWater_vals} />
              </div>
              <div style={styles.stressedItem}>
                <p style={styles.stressedTextCenter}>Avg Crop Evapotranspiration (last 5 days)</p>
                <WaterUseGauge style={{ marginTop: '-25px'}} ke={Ke_vals} kc={Kc_vals}/>
              </div>
              <div style={styles.stressedItem}>
                <p style={styles.stressedText}>Estimated Yield (%)</p>
                <YieldGauge style={{ marginTop: '-25px'}} ke={Ke_vals} />
              </div>
            </div>

            <MainPlot waterDeficit_f={WaterDeficit_final_vals} waterDeficit_p={WaterDeficit_p_vals} waterDeficit_a={WaterDeficit_a_vals} kc={Kc_vals} availableWater={AvailableWater_vals} activeField={this.props.activeField[0]} />
            <br/>
            <br/>
          </div>
        </Tab>
        <Tab label="Extra" value="b" style={styles.heading}>
          <div>
            {/*<h2 style={styles.headline}>Secondary Plots/Tables</h2>*/}
            <div style={styles.activeFieldInfo}>
              <p style={styles.activeFieldItemHead}>{this.props.activeField[0].FieldName}</p>
              <p style={styles.activeFieldItem}><span style={styles.itemHeading}>Crop</span><br/>{this.props.activeField[0].crop}</p>
              <p style={styles.activeFieldItem}><span style={styles.itemHeading}>Location</span><br/>{this.props.activeField[0].location}</p>
              <p style={styles.activeFieldItem}><span style={styles.itemHeading}>Soil</span><br/>{this.props.activeField[0].soil}</p>
              <p style={styles.activeFieldItem}><span style={styles.itemHeading}>Plant Date</span><br/>{this.props.activeField[0].plantDate}</p>
            </div>
            <DistributionTable kc={Kc_vals} ke={Ke_vals} />
            <hr/>
            <DistributionPlot kc={Kc_vals} ke={Ke_vals} />
            <hr/>
            <DistributionSumPlot kc={Kc_vals} ke={Ke_vals} />
            {/*<YieldPlot ETc_final={Ke_vals} ETo={ETo_vals} ETcp={ETcp_vals} ETca={ETca_vals} plantDate={this.props.activeField[0].plantDate} />*/}
            {/*<KcPlot kc={Kc_vals} kcb={Kcb_vals} ke={Ke_vals} />*/}
            <hr/>
            <PrecipPlot kc={Kc_vals} kcb={Kcb_vals} ke={Ke_vals} />
            <hr/>
            <RainDeficitPlot ke={Ke_vals} ETo={ETo_vals} plantDate={this.props.activeField[0].plantDate}/>
            <hr/>
            <EToPlot ETc_final={Ke_vals} ETo={ETo_vals} ETcp={ETcp_vals} ETca={ETca_vals} plantDate={this.props.activeField[0].plantDate} />
            <hr/>
            <ETsumPlot ETc_final={Ke_vals} ETo={ETo_vals} ETcp={ETcp_vals} ETca={ETca_vals} plantDate={this.props.activeField[0].plantDate} />
            <hr/>
          </div>
        </Tab>
      </Tabs>
      </MuiThemeProvider>
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
  },
  itemHeading:{
    fontSize: '15px',
    fontWeight: '100',
  },
  activeFieldInfo:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10px',
    padding: '18px',
    background: '#f9f9f9',
    border: '1px solid #f0f0f0',
  },
  activeFieldItem:{
    flex:'1',
    textAlign:'center',
    fontSize:'14px',
    margin: '0px',
    fontWeight: '200',
  },
  activeFieldItemHead:{
    flex:'1',
    textAlign:'center',
    fontSize:'20px',
    margin: '0px',
    fontWeight: '200',
  },
  stressedBox:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '0px',
    marginBottom: '10px',
    padding: '12px',
    background: '#fdfdfd',
    border: '1px solid #f0f0f0',
  },
  stressedItem:{
    flex:'1',
    textAlign:'center',
    //fontSize:'20px',
    margin: '5px 0px 0px 0px',
    fontWeight: '300',
  },
    stressedText:{
    textAlign:'center',
    //fontSize:'20px',
    margin: '0px 0px -25px 0px',
    fontWeight: '300',
  },
  stressedTextCenter:{
    textAlign:'center',
    //fontSize:'20px',
    margin: '-35px 0px -25px 0px',
    fontWeight: '300',
  },
};

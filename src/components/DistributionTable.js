import React, { Component } from 'react';
import './tableStyle.css';
import Collapse from 'react-bootstrap/lib/Collapse';
import Button from 'react-bootstrap/lib/Button';

export default class DistributionTable extends Component {

    constructor(props) {
    super(props);
    this.state = {};
  }

    render() {

      var kcData = [];
      var TimeStamp = "T00:00:00";
      for(var i=0; i < this.props.ke.precipitation.length; i++){
          //kcData[i] = new Array(2);
          kcData[i] = {
            date: this.props.ke.weather[i].the_date,
            sm: Math.round(this.props.ke.sm[i]*100)/100,
            Dr: Math.round(this.props.ke.Dr_end[i]*100)/100,
            Dr_diff: Math.round(this.props.ke.Dr_diff[i]*100)/100,
            precip: Math.round(this.props.ke.precipitation[i]*100)/100,
            irr: Math.round(this.props.ke.irrigation[i]*100)/100,
            water: Math.round(this.props.ke.water[i]*100)/100, 
            evap: Math.round(this.props.ke.evap[i] * 100) / 100,
            transp: Math.round(this.props.ke.transpiration_a[i]*100)/100,
            ETc: Math.round(this.props.ke.ETc_in_a[i]*100)/100,
            DPrz: Math.round(this.props.ke.DP_rz[i]*100)/100, 
            DPe: Math.round(this.props.ke.DPe[i]*100)/100,
            DP: Math.round((this.props.ke.DPe[i] + this.props.ke.DP_rz[i])*100)/100,
            runOff: Math.round(this.props.ke.runOff[i]*100)/100 

          }
          //kcData[i][3] =  this.props.ke.transp[i];
          //kcData[i][4] =  this.props.ke.DP_rz[i];
          //kcData[i][5] =  this.props.ke.DPe[i];
          //kcData[i][5] =  this.props.ke.runOff[i];
      }

var distNodes = kcData.map( (val, index ) => {
    return(
          <div style={styles.rowBox} key={ index }>
            <p style={styles.rowItem}>{val.date}</p>
            <p style={styles.rowItem}>{val.sm}</p>
            <p style={styles.rowItem}>{val.Dr_diff}</p>
            <p style={styles.rowItem}>{val.water}</p>
            <p style={styles.rowItem}>{val.ETc}</p>
            <p style={styles.rowItem}>{val.DP}</p>
            <p style={styles.rowItem}>{val.runOff}</p>
          </div>
        );
  })

        return(

      <div>
        <Button className={'tableButton'} onClick={ ()=> this.setState({ open: !this.state.open })}>
          Toggle Water Distribution Table
        </Button>


          <table className={this.state.open ? null : 'hidden'}>
            <tr>
              <td>Date</td>
              <td>Soil Moisture (mm)</td>
              <td>Delta Water (mm)</td>
              <td>Water Added (mm)</td>
              <td>Evapotranspiration (mm)</td>
              <td>Deep Percolation (mm)</td>
              <td>Run Off<br/>(mm)</td>
            </tr>
           </table> 
          <div className={this.state.open ? null : 'hidden'} style={styles.rowGroup}>
          {distNodes}
          </div>
      </div>


          );
    }
}

const styles = {
  chart_dist: {
    width: '100%',
  },
  rowBox:{
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '0px',
    marginBottom: '-1px',
    padding: '12px',
    background: '#fdfdfd',
    border: '1px solid #f0f0f0',
  },
  rowItem:{
    flex:'1',
    textAlign:'center',
    //fontSize:'20px',
    margin: '5px 0px 0px 0px',
    fontWeight: '300',
  },
  rowGroup:{
    height:'350px',
    overflowY: 'scroll'
  },
}
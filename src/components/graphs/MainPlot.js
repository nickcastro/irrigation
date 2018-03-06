import React, { Component } from 'react';
import Dygraph from 'dygraphs';
import './graph.css';
//import ETo from '../calculations/ETo.js'
//import Kc.js

export default class MainPlot extends Component {

componentDidUpdate() {

  //console.log(this.props.availableWater);

  var waterDataLength = this.props.availableWater.Taw.length;

      // iterate over valules, push to 2d array
      var waterData = new Array(waterDataLength);
      var TimeStamp = "T00:00:00";
      for(var i = 0; i < waterDataLength; i++){
          waterData[i] = new Array(3);
          waterData[i][0] =  new Date(this.props.kc.Date[i]+TimeStamp);
          waterData[i][1] =  this.props.availableWater.Taw[i];
          waterData[i][2] =  this.props.availableWater.Raw[i];
          //waterData[i][3] = this.props.waterDeficit_p[i];
          waterData[i][3] = this.props.waterDeficit_f[i];

      }

      new Dygraph(this.refs.chart_mainPlot, waterData, {
          title: 'Soil Water Plot',
          labels: [ "Date", "Total Available Water", "Readily Available Water", "Water Deficit"],
          showRangeSelector: true,
          labelsDiv: 'labelsDiv_mainPlot',
          height: 400,
          ylabel: 'Water (in)',
          series: {
            'Total Available Water': {
              color: '#2979ff'
            }, 
            'Readily Available Water': {
              color: '#ffca28'
            }, 
            'waterDeficit_f': {
              color: '#43a047'
            }, 
              'waterDeficit_a': {
              color: '#e53935'
            }
          }
        });
      //console.log(this.props.kc);
    }

    render() {
        return(
          <div>
          <div id="labelsDiv_mainPlot"></div>
          <br/>
          <div style={styles.chart_mainPlot} ref="chart_mainPlot"></div>
          </div>

          );
    }
}

const styles = {
  chart_mainPlot: {
    width: '100%',
  },

};
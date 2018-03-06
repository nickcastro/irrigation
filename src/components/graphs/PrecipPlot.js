import React, { Component } from 'react';
import Dygraph from 'dygraphs';
import './graph.css';

export default class PrecipitationPlot extends Component {


  barChartPlotter(e) {
    var ctx = e.drawingContext;
    var points = e.points;
    var y_bottom = e.dygraph.toDomYCoord(0);
               
    // This should really be based on the minimum gap
    var bar_width = 2/3 * (points[1].canvasx - points[0].canvasx);
    ctx.fillStyle = e.color;
               
    // Do the actual plotting.
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      var center_x = p.canvasx;  // center of the bar
               
      ctx.fillRect(center_x - bar_width / 2, p.canvasy,
      bar_width, y_bottom - p.canvasy);
      ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
      bar_width, y_bottom - p.canvasy);
    }
  }

    componentDidUpdate() {

      // iterate over kc, push to 2d array
      var kcData = new Array(this.props.kc.Date.length);
      var TimeStamp = "T00:00:00";
      var cumulativeWater = 0;
      var cumulativeETc = 0;
      for(var i=0; i < this.props.kc.Date.length; i++){
          cumulativeWater += this.props.ke.water[i]*0.0393701;
          cumulativeETc += (this.props.ke.ETc_in_a[i]);
          kcData[i] = new Array(2);
          kcData[i][0] =  new Date(this.props.kc.Date[i]+TimeStamp);
          kcData[i][1] =  this.props.ke.water[i]*0.0393701;
          kcData[i][2] =  cumulativeWater;
          kcData[i][3] =  cumulativeETc;
      }

      //console.log(kcData);

      new Dygraph(this.refs.Precipchart, kcData, {
          title: 'Precipitation and Evapotranspiration',
          labels: [ "Date", "Daily Water", "Cumulative Water", "Cumulative Evapotranspiration"],
          showRangeSelector: true,
          labelsDiv: 'labelsDiv_precip',
          height: 400,
          axes: {x: {drawGrid: false}, y2: {valueRange: [0, 8]} },
          ylabel: 'Water (in)',
          y2label: 'Water (in)',
          series: {
            'Cumulative Water': {
              color: '#e53935'
            }, 
            'Cumulative Evapotranspiration': {
              color: '#43a047'
            }, 
              'Daily Water': {
              axis : 'y2',
              color: '#2979ff',
              plotter: this.barChartPlotter.bind(this)
            }
          }
                 
        });
      //console.log(this.props.kc);
    }

    render() {
        return(
          <div>
          <div id="labelsDiv_precip"></div>
          <br/>
          <div style={styles.Precipchart} ref="Precipchart"></div>
          </div>

          );
    }
}

const styles = {
  Precipchart: {
    width: '100%',
  },

};
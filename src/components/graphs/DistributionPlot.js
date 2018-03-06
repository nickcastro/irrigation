import React, { Component } from 'react';
import Dygraph from 'dygraphs';
import './graph.css';

export default class DistributionPlot extends Component {


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
      for(var i=0; i < this.props.kc.Date.length; i++){
          kcData[i] = new Array(2);
          kcData[i][0] =  new Date(this.props.kc.Date[i]+TimeStamp);
          //kcData[i][1] =  this.props.ke.water[i]*0.0393701;
          kcData[i][1] =  this.props.ke.evap[i]*0.0393701;
          kcData[i][2] =  this.props.ke.transpiration_a[i]*0.0393701;
          kcData[i][3] =  this.props.ke.DP_rz[i]*0.0393701 + this.props.ke.DPe[i]*0.0393701;
          kcData[i][4] =  this.props.ke.runOff[i]*0.0393701;
      }

      //console.log(kcData);

      new Dygraph(this.refs.chart_dist, kcData, {
          title: 'Water Distribution',
          labels: [ "Date", "Evaporation", "Transpiration", "Deep Percolation", "Run Off"],
          showRangeSelector: true,
          labelsDiv: 'labelsDiv_dist',
          height: 400,
          ylabel: 'Water (in)',
          y2label: 'Water (in)',
          fillGraph: true,
          axes: {x: {drawGrid: false,}, y: {valueRange: [0, 0.4]}, y2: {valueRange: [0, 7]} },
          series: {
            /*'Water': {
              axis: 'y2',
              color: '#2979ff',
              plotter: this.barChartPlotter.bind(this)
            },*/
          'Deep Percolation': {
              axis: 'y2',
              color: '#2979ff',
              //plotter: this.barChartPlotter.bind(this)
            }, 
            'Evaporation': {
              color: '#e53935'
            }, 
            'Transpiration': {
              color: '#43a047'
            }
          }
                 
        });
      //console.log(this.props.kc);
    }

    render() {
        return(
          <div>
          <div id="labelsDiv_dist"></div>
          <br/>
          <div style={styles.chart_dist} ref="chart_dist"></div>
          </div>

          );
    }
}

const styles = {
  chart_dist: {
    width: '100%',
  },

};
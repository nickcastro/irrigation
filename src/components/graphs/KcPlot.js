import React, { Component } from 'react';
import Dygraph from 'dygraphs';
import './graph.css';

export default class KcPlot extends Component {


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
          kcData[i][1] =  this.props.kc.Kc[i];
          kcData[i][2] =  this.props.kcb[i];
          kcData[i][3] =  this.props.ke.ke[i];
          kcData[i][4] =  this.props.ke.water[i];
      }

      //console.log(kcData);

      new Dygraph(this.refs.chart, kcData, {
          title: 'Kc Plot',
          labels: [ "Date", "Kc", "Kcb", "Ke", "water"],
          showRangeSelector: true,
          labelsDiv: 'labelsDiv',
          height: 400,
          axes: {x: {drawGrid: false}, y2: {valueRange: [0, 180]} },
          series: {
            'Kc': {
              color: '#2979ff'
            }, 
            'Kcb': {
              color: '#e53935'
            }, 
            'Ke': {
              color: '#43a047'
            }, 
              'water': {
              axis:'y2',
              color: '#ffca28',
              plotter: this.barChartPlotter.bind(this)
            }
          }
                 
        });
      //console.log(this.props.kc);
    }

    render() {
        return(
          <div>
          <div id="labelsDiv"></div>
          <br/>
          <div style={styles.chart} ref="chart"></div>
          </div>

          );
    }
}

const styles = {
  chart: {
    width: '100%',
  },

};
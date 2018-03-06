import React, { Component } from 'react';
import Dygraph from 'dygraphs';
import './graph.css';

export default class ETPlot extends Component {


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
          kcData[i][1] =  this.props.ke.evap[i];
          kcData[i][2] =  this.props.ke.transp[i];
          kcData[i][3] =  this.props.ke.ke[i];
      }

      //console.log(kcData);

      new Dygraph(this.refs.ETchart, kcData, {
          title: 'ET Plot',
          labels: [ "Date", "Evap", "Transp", "Ke"],
          showRangeSelector: true,
          labelsDiv: 'labelsDiv_ET',
          height: 400,
          series: {
            'Evap': {
              color: '#2979ff'
            }, 
            'Transp': {
              color: '#e53935'
            }
          }
                 
        });
      //console.log(this.props.kc);
    }

    render() {
        return(
          <div>
          <div id="labelsDiv_ET"></div>
          <br/>
          <div style={styles.chart} ref="ETchart"></div>
          </div>

          );
    }
}

const styles = {
  ETchart: {
    width: '100%',
  },

};
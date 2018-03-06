import React, { Component } from 'react';
import NVD3Chart from "react-nvd3";
import nv from 'nvd3';
import d3 from 'd3';

import './graph.css';

export default class RainDeficitPlot extends Component {

    componentDidUpdate() {

      var TimeStamp = "T00:00:00";
      var plantDate = new Date(this.props.plantDate + TimeStamp);

      var EToLength = 0;

      for(var i = 0; i < this.props.ETo.Date.length; i++){
        var date = new Date(this.props.ETo.Date[i]+TimeStamp);
        if(date.getTime() > plantDate.getTime())
          EToLength++;
      }

      //console.log(EToLength);

      var ETc_sum = 0;
      var rain_sum = 0;
      var startInd = this.props.ETo.Date.length - EToLength;

      for(i = 0; i < EToLength; i++){
        date = new Date(this.props.ETo.Date[startInd]+TimeStamp);
        if(date.getTime() > plantDate.getTime()){
          ETc_sum += this.props.ke.ETc_in_a[i];
          rain_sum += this.props.ke.precipitation[i]*0.0393701;
          startInd++;
        }
      }


      var datum = [
    {
      key: "Water",
      values: [
        {
          "label" : "Cumulative Water Use",
          "value" : ETc_sum
        },
        {
          "label" : "Cumulative Rain",
          "value" : rain_sum
        },
        {
          "label" : "Rain Deficit",
          "value" : ETc_sum-rain_sum
        }
      ]
    }
  ]


      //console.log(nv);
      // Age Discrete Bar Chart
nv.addGraph(function() {
  var chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })    //Specify the data accessors.
      .y(function(d) { return d.value })
      .showValues(true)       //...instead, show the bar value right on top of each bar.
      .showXAxis(true)
      .showYAxis(true)
      .color(['#193c67', '#1ba1dc', '#b74424', '#fc6a22', '#81ae7e', '#ec413e', '#f39388', '#736964', '#951c58', '#0e6bb3', '#fc6a22', '#221f57', '#a49d9b', '#f8dc46', '#337355', '#d01925', '#fecb88'])
      ;

      //console.log(chart);

  d3.select('#ageChart svg')
      .datum(datum)
      .call(chart)
      .attr("width", '100%')
      .attr("height", '300px');

  //nv.utils.windowResize(chart.update);
  chart.yAxis     //Chart x-axis settings
      .axisLabel('Water (in)')
      .ticks(8)
      .tickFormat(d3.format(',.0d'));
  chart.tooltip.enabled(false);
  chart.update();

  return chart;
});

}


    render() {

        return(
          <div>
        <div id="ageChart">
          <h2 style={styles.title}>Rain Deficit</h2>
          <svg></svg>
        </div>   
        </div>

          );
    }
}

const styles = {
  title:{
  fontSize:'20px',
  textAlign:'center',
  fontWeight:'400',
  marginTop:'40px',
  },
};
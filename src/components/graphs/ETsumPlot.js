import React, { Component } from 'react';
import Dygraph from 'dygraphs';
import './graph.css';

export default class ETsumPlot extends Component {

    componentDidUpdate() {

      //console.log(this.props.ETcp);

      // set 0 timestamp to normalize Dates
      var TimeStamp = "T00:00:00";
      var plantDate = new Date(this.props.plantDate + TimeStamp);


      var EToLength = 0;

      for(var i = 0; i < this.props.ETo.Date.length; i++){
        var date = new Date(this.props.ETo.Date[i]+TimeStamp);
        if(date.getTime() > plantDate.getTime())
          EToLength++;
      }

      //console.log(EToLength);

      var ETcp_sum = 0;
      var ETca_sum = 0;


      var EToData = new Array(EToLength);
      var startInd = this.props.ETo.Date.length - EToLength;

      for(i = 0; i < EToLength; i++){
        date = new Date(this.props.ETo.Date[startInd]+TimeStamp);
        if(date.getTime() > plantDate.getTime()){

          ETcp_sum += this.props.ETc_final.ETc_in_p[i];
          ETca_sum += this.props.ETc_final.ETc_in_a[i];

          EToData[i] = new Array(3);
          EToData[i][0] = new Date(this.props.ETo.Date[startInd]+TimeStamp);
          EToData[i][1] = ETcp_sum;
          EToData[i][2] = ETca_sum;
          startInd++;
        }
      }

      //console.log(EToData);
      

      new Dygraph(this.refs.ETsumchart, EToData, {
          title: 'Cumulative Crop Evapotranspiration',
          labels: [ "Date", "Evapotranspiration Potential", "Evapotranspiration Actual"],
          showRangeSelector: true,
          labelsDiv: 'labelsDiv_ETsum',
          height:400,
          fillGraph: true,
          ylabel: 'Water (in)'
        });

    }

    render() {
        return(
          <div>
          
          <div id="labelsDiv_ETsum"></div>
          <br/>
          <div style={styles.ETsumchart} ref="ETsumchart"></div>
          </div>

          );
    }
}

const styles = {
  ETsumchart: {
    width: '100%',
  },

};
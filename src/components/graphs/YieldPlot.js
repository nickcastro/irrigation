import React, { Component } from 'react';
import Dygraph from 'dygraphs';
import './graph.css';

export default class YieldPlot extends Component {

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

      //console.log(this.props);

      var EToData = new Array(EToLength);
      var startInd = this.props.ETo.Date.length - EToLength;

      for(i = 0; i < EToLength; i++){
        date = new Date(this.props.ETo.Date[startInd]+TimeStamp);
        if(date.getTime() > plantDate.getTime()){
          EToData[i] = new Array(2);
          EToData[i][0] =  new Date(this.props.ETo.Date[startInd]+TimeStamp);
          EToData[i][1] =  this.props.ETc_final.ETc_in_a[i]/this.props.ETc_final.ETc_in_p[i]; 
          startInd++;
        }
      }

      //console.log(EToData);
      

      new Dygraph(this.refs.Yieldchart, EToData, {
          title: 'Yield Plot',
          labels: [ "Date", "%"],
          showRangeSelector: true,
          labelsDiv: 'labelsDiv_Yield',
          height:400,
          fillGraph: true
        });

    }

    render() {
        return(
          <div>
          
          <div id="labelsDiv_Yield"></div>
          <br/>
          <div style={styles.ETochart} ref="Yieldchart"></div>
          </div>

          );
    }
}

const styles = {
  Yieldchart: {
    width: '100%',
  },

};
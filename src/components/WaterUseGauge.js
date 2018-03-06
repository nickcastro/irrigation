import React, { Component } from 'react';
import Gauge from 'react-svg-gauge';
 
function getHexColor(value) {
	var string = value.toString(16);
	return (string.length === 1) ? '0' + string : string;
}

export default class WaterUseGauge extends Component {

componentDidMount(){

    setTimeout(() => {
            this.fadeIn();
        }, 100);
  }


  fadeIn() {
    document.getElementById("waterGauge").style.opacity = 1;
}

    render() {

  var style={
  	opacity: 0,
  	transition: '0.8s',
	};

  var et={
    textAlign:'center',
    paddingTop:50,
    fontSize: 30,
  };
      var cumulativeWater = 0;
      var cumulativeETc = 0;
      for(var i=0; i < this.props.ke.ETo_mm.length; i++){
          cumulativeWater += this.props.ke.water[i]*0.0393701;
          cumulativeETc += (this.props.ke.ETc_in_a[i]);
      }

      var avgET = 0;
      console.log(this.props.ke.ETo_mm);
      for(i = 1; i <= 5; i++){
        avgET += this.props.ke.ETc_in_a[this.props.ke.ETo_mm.length - i];
        //console.log(avgET);
      }

      avgET /= 5;
      avgET = avgET.toFixed(2);

      //console.log(cumulativeWater);
      //console.log(cumulativeETc);

      var waterVal = Math.round(100*(cumulativeETc/cumulativeWater));

    	var g = Math.floor(waterVal * 2.55);
		var r = Math.floor(255 - (waterVal * 2.55));
		var b = 0;
		var colorHex = '#' + getHexColor(r)  + getHexColor(g)  + getHexColor(b) ;
        return (
            <div style={style} id={"waterGauge"}>
                {/*<Gauge value={waterVal} width={170} height={130} color={'#109DC0'} label=" " />*/}
                <p style={et}>{avgET} in.</p>
            </div>
        );
    }
}



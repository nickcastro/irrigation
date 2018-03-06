import React, { Component } from 'react';
import Gauge from 'react-svg-gauge';
 
function getHexColor(value) {
	var string = value.toString(16);
	return (string.length === 1) ? '0' + string : string;
}

export default class StressGauge extends Component {

componentDidMount(){

    setTimeout(() => {
            this.fadeIn();
        }, 100);
  }


  fadeIn() {
    document.getElementById("stressGauge").style.opacity = 1;
}

    render() {

    	var style={
  	opacity: 0,
  	transition: '0.8s',
	};
    	var aw = this.props.availableWater;
    	var wd = this.props.waterDeficit_f;

    	//console.log(aw.Taw[aw.Taw.length - 1]);
    	//console.log(wd[wd.length - 1]);

        //old gauge color: #1976D2

    	var stressVal = 100 - Math.min(Math.round(100*(wd[wd.length - 1]/aw.Raw[aw.Raw.length - 1])),100);
    	//console.log(stressVal);

    	//var stressVal = 10;
    	//var stressVal = 100*(aw.Taw[aw.Taw.length - 1] - wd[wd.length - 1]);
    	var r = Math.floor(stressVal * 2.55);
		var g = Math.floor(255 - (stressVal * 2.55));
		var b = 0;
		var colorHex = '#' + getHexColor(r)  + getHexColor(g)  + getHexColor(b) ;
        return (
            <div style={style} id={"stressGauge"}>
                <Gauge value={stressVal} width={170} height={130} color={'#109DC0'} label=" " />
            </div>
        );
    }
}



import React, { Component } from 'react';
import Gauge from 'react-svg-gauge';
 
function getHexColor(value) {
	var string = value.toString(16);
	return (string.length === 1) ? '0' + string : string;
}

export default class YieldGauge extends Component {

componentDidMount(){

    setTimeout(() => {
            this.fadeIn();
        }, 100);
  }


  fadeIn() {
    document.getElementById("yieldGauge").style.opacity = 1;
}

    render() {

    	var style={
  	opacity: 0,
  	transition: '0.8s',
	};
    	var Tca = this.props.ke.sumTca;
    	var Tcp = this.props.ke.sumTcp;

    	//console.log(Tca/Tcp);
    	//console.log(Tcp);

    	var yieldVal = Math.round(100*(Tca/Tcp));

    	var g = Math.floor(yieldVal * 2.55);
		var r = Math.floor(255 - (yieldVal * 2.55));
		var b = 0;
		var colorHex = '#' + getHexColor(r)  + getHexColor(g)  + getHexColor(b) ;
        return (
            <div style={style} id={"yieldGauge"}>
                <Gauge value={yieldVal} width={170} height={130} color={'#109DC0'} label=" " />
            </div>
        );
    }
}



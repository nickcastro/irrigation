import KcTable from '../components/json/KcTable.json'
import SoilTable from '../components/json/Soils.json'

export default function AvailableWater(Crop, Soil, Kc) {
    
  for(var i = 0; i < KcTable.length; i++){
    if(KcTable[i].Crop == Crop){
      var myCrop = KcTable[i];
    }
  }

  for(i = 0; i < SoilTable.length; i++){
    if(SoilTable[i].Texture == Soil){
      var mySoil = SoilTable[i];
    }
  }

  //console.log(myCrop);
  //console.log(mySoil);

  var whc = mySoil['(FC-PWP)'];

  var tawVec = new Array(Kc.Date.length);
  var rawVec = new Array(Kc.Date.length);

  var taw_increment = ((whc*myCrop.Rzmax)-(whc*myCrop.Rzmin))/myCrop.DAP;
  var raw_increment = (((whc*myCrop.Rzmax)-(whc*myCrop.Rzmin))/myCrop.DAP)*myCrop.MAD;

  //console.log(taw_increment);
  //console.log(raw_increment);

    tawVec[0] = myCrop.Rzmin*whc;
    rawVec[0] = myCrop.Rzmin*whc*myCrop.MAD;
    
    for(i = 1; i < myCrop.DAP; i++){
      tawVec[i] = tawVec[(i-1)]+taw_increment;
      rawVec[i] = rawVec[(i-1)]+raw_increment;
    }

    for(i = Number(myCrop.DAP); i < Kc.Date.length; i++){
      tawVec[i] = myCrop.Rzmax*whc;
      rawVec[i] = myCrop.Rzmax*whc*myCrop.MAD;
    }
    
    var toReturn = {Taw: tawVec, Raw: rawVec};

    //console.log(toReturn);

    return(toReturn);

  }
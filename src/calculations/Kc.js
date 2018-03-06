import KcTable from '../components/json/KcTable.json'

export default function Kc(crop, plantDate) {

  //console.log(KcTable);
  //console.log(plantDate);

  var TimeStamp = "T00:00:00";
  var plantDateFormatted = new Date(plantDate + TimeStamp);
  var theDate = plantDateFormatted;

  for(var i = 0; i < KcTable.length; i++){
    if(KcTable[i].Crop == crop){
      var myCrop = KcTable[i];
    }
  }

//console.log(myCrop);


// Calculate FAO-56 daily kc values (adjusted to data)
  var kc_in = Number(myCrop.Kci);
  var kc_mid = Number(myCrop.Kcm);
  var kc_end = Number(myCrop.Kce);
  var x1 = Number(myCrop.L1);    //20# days of development stages
  var x2 = Number(myCrop.L2);
  var x3 = Number(myCrop.L3);
  var x4 = Number(myCrop.L4);
  var tl = Number(myCrop.Total);
  
  var kc = [];
  var DAP = [];
  var Dates = [];

  var KcFrame = {};
  
  
  for(i = 0; i < tl; i++){
    if(i < x1){
      kc[i]=kc_in;
    } 
    else if(i >= x1 && i < (x1+x2) ){
      kc[i] = kc[i-1] + (kc_mid - kc_in)/x2;
    } 
    
    else if(i >= (x1+x2) && i < (x1+x2+x3)){
      kc[i]=kc_mid;
    }
    
    else{
      kc[i] = kc[i-1]-(kc_mid-kc_end)/x4;
    }    
  
    DAP[i] = i+1;
    theDate = new Date(theDate.getTime() + 86400000);
    Dates[i] = theDate.toISOString().slice(0, 10);

  }


  //console.log(kc);
  //console.log(DAP);
  //console.log(Dates);
 

  KcFrame = {Date: Dates, DAP: DAP, Kc: kc};


  return(KcFrame);

  }
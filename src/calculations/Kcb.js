import KcTable from '../components/json/KcTable.json'

export default function Kcb(Weather, crop, plantDate){
    
  for(var i = 0; i < KcTable.length; i++){
    if(KcTable[i].Crop == crop){
      var myCrop = KcTable[i];
    }
  }

  //console.log(myCrop);

  var TimeStamp = "T00:00:00";
  var plantDateFormatted = new Date(plantDate + TimeStamp);

  var newWeather = [];

  var count = 0;
  for(var i = 0; i < Weather.length; i++){
    var weatherDate = new Date(Weather[i].the_date+TimeStamp);
    if(weatherDate.getTime() > plantDateFormatted.getTime()){
      newWeather[count] = Weather[i];
      count++;
    }
  }

  //console.log(newWeather);

  var Kcb_vec = [];

  var Kcbi = Number(myCrop.Kcbi);
  var Kcbm = Number(myCrop.Kcbm);
  var Kcbe = Number(myCrop.Kcbe);
    
    //# of days of development
  var x1 = Number(myCrop.L1); 
  var x2 = Number(myCrop.L2);
  var x3 = Number(myCrop.L3);
  var x4 = Number(myCrop.L4);
  var tl = Number(myCrop.Total);
  var h = Number(myCrop.hMax);

  var wind_sum = 0;
  var relative_humidity_sum = 0;

  for(i = 0; i < newWeather.length; i++){
    wind_sum += newWeather[i].wind_mph;
    relative_humidity_sum += newWeather[i].relative_humidity;
  }


  var wind_avg = wind_sum/newWeather.length;

  //convert wind speed from mph to m/s
  wind_avg = wind_avg * 0.44704;
  // convert wind speed at 5ft to wind speed at 2m
  var u2 = wind_avg * (4.87/(Math.log(67.8 * 1.54 - 5.42)));

  var hmd_avg = relative_humidity_sum/newWeather.length;

  if(u2 != 2 || hmd_avg != 45){
    if(Kcbm > 0.45){
      Kcbm = Kcbm + ( 0.04 * (u2 - 2) - .004 * (hmd_avg - 45) ) * Math.pow((h/3),0.3);
    }
    if(Kcbe > 0.45){
      Kcbe = Kcbe + ( 0.04 * (u2 - 2) - .004 * (hmd_avg - 45) ) * Math.pow((h/3),0.3);
    }
  }

  for(i = 0; i < tl; i++){
      if(i < x1){
        Kcb_vec[i] = Kcbi;
      } 
      if (i >= x1 && i < (x1+x2)){
        Kcb_vec[i] = Kcb_vec[i-1] + (Kcbm-Kcbi)/x2;
      } 
      
      if (i >= (x1+x2) && i < (x1+x2+x3)){
        Kcb_vec[i] = Kcbm;
      }
      
      if (i >= (x1+x2+x3) && i < (x1+x2+x3+x4)){
        Kcb_vec[i] = Kcb_vec[i-1] - (Kcbm-Kcbe)/x4;
      }    
      
    }

    //console.log(Kcb_vec);


  return(Kcb_vec);

}
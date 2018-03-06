
export default function WaterDeficit_final(Irrigation, Kc, ETcp, ETc_final, availableWater, Weather, plantDate) {
    
   /*console.log(Irrigation);
  console.log(Kc);*/
  //console.log(ETc_final);
  //console.log(availableWater);
  //console.log(Weather);
  //console.log(plantDate);

  var ETc_f = ETc_final.ETc_in_a;

  //console.log(ETc_f);

  var precipitation = {};

  var TimeStamp = "T00:00:00";
  var plantDateFormatted = new Date(plantDate + TimeStamp);

  var count = 0;
  for(var i = 0; i < Weather.length; i++){
    var weatherDate = new Date(Weather[i].the_date+TimeStamp);
    if(weatherDate.getTime() > plantDateFormatted.getTime()){
      precipitation[count] = {Date: Weather[i].the_date, rain: Weather[i].precipitation}
      count++;
    }
  }

  //console.log(precipitation);

  // intialize deficitVector
  var deficitVector = [];
  /*for(i = 0; i < Kc.Date.length; i++){
    deficitVector[i] = 0;
  }*/

  //console.log(deficitVector);

  deficitVector[0] = ETc_f[0];
  for(i = 1; i < ETcp.ETcp.length; i++){
    deficitVector[i] = Math.min(Math.max(deficitVector[i-1] - (Irrigation.Amount[i] + precipitation[i].rain) + ETc_f[i], 0), availableWater.Taw[i]);
  }

  //console.log(deficitVector);

  return(deficitVector);

}

export default function WaterDeficit_a(Irrigation, Kc, ETcp, ETca, availableWater, Weather, plantDate) {
    
   /*console.log(Irrigation);
  console.log(Kc);*/
  //console.log(ETcp);
  //console.log(availableWater);
  //console.log(Weather);
  //console.log(plantDate);

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

  deficitVector[0] = ETca[0];
  for(i = 1; i < ETcp.ETcp.length; i++){
    deficitVector[i] = Math.min(Math.max(deficitVector[i-1] - (Irrigation.Amount[i] + precipitation[i].rain) + ETca[i], 0), availableWater.Taw[i]);
  }

  //console.log(deficitVector);

  return(deficitVector);

}
export default function ETc_final(ETo, Ke, plantDate) {

  //console.log(ETo);
  //console.log(Kc);
  //console.log(ETo.Date.length);
  var dates = [];
  var ETc_final_vals = [];

  var TimeStamp = "T00:00:00";
  var plantDateFormatted = new Date(plantDate + TimeStamp);

  var ETcLength = 0;

  for(var i = 0; i < ETo.Date.length; i++){
    //dates[i] = ETo.Date[i];
    //ETcp_vals[i] = ETo.ETo_in[i]*Kc.Kc[i];
    var date = new Date(ETo.Date[i]+TimeStamp);
    if(date.getTime() > plantDateFormatted.getTime()){
      ETcLength++;
    }
  }  

  //console.log(ETcpLength);

  //index for values after plant date
  var startInd = ETo.Date.length - ETcLength;

  for(var i = 0; i < ETcLength; i++){
    dates[i] = ETo.Date[startInd];
    //eq 69.
    // ETc = (Kcb+Ke)*ETo
    ETc_final_vals[i] = ETo.ETo_in[startInd]*Ke.ke[i];
    startInd++;
  }

  //ETcp vals in inches per original R script
  var toReturn = {Date: dates, ETc_final: ETc_final_vals};

  //console.log(toReturn);

  return(toReturn);

  }
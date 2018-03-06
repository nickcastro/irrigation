export default function ETcp(ETo, Kc, plantDate) {

  //console.log(ETo);
  //console.log(Kc);
  //console.log(ETo.Date.length);
  var dates = [];
  var ETcp_vals = [];

  var TimeStamp = "T00:00:00";
  var plantDateFormatted = new Date(plantDate + TimeStamp);

  var ETcpLength = 0;

  for(var i = 0; i < ETo.Date.length; i++){
    //dates[i] = ETo.Date[i];
    //ETcp_vals[i] = ETo.ETo_in[i]*Kc.Kc[i];
    var date = new Date(ETo.Date[i]+TimeStamp);
    if(date.getTime() > plantDateFormatted.getTime()){
      ETcpLength++;
    }
  }  

  //console.log(ETcpLength);

  //index for values after plant date
  var startInd = ETo.Date.length - ETcpLength;

  for(var i = 0; i < ETcpLength; i++){
    dates[i] = ETo.Date[startInd];
    ETcp_vals[i] = ETo.ETo_in[startInd]*Kc.Kc[i];
    startInd++;
  }

  //ETcp vals in inches per original R script
  var toReturn = {Date: dates, ETcp: ETcp_vals};

  //console.log(ETcp);

  return(toReturn);

  }
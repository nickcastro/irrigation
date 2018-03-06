export default function Ks(waterDeficit, availableWater, Kc, ETcp) {
    
  //console.log(waterDeficit);
  //console.log(availableWater);
  //console.log(Kc);

  //if water deficit exceeds readily availably water..

  var KsVector = [];

  for(var i = 0; i < Kc.Date.length; i++){
    KsVector[i] = 0;
  }

  for(i = 0; i < ETcp.ETcp.length; i++){
    if(waterDeficit[i] >= availableWater.Raw[i]){
        KsVector[i] = (availableWater.Taw[i] - waterDeficit[i])/(availableWater.Taw[i] - availableWater.Raw[i]);
      } else {
        KsVector[i] = 1; 
      }
  }

  //console.log(KsVector);
  
  return(KsVector);

  }
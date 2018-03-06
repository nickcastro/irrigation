export default function ETca(Ks, ETcp) {
    
  //console.log(Ks);
  //console.log(ETcp);

  var ETca = [];
  for(var i = 0; i < Ks.length; i++){
    ETca[i] = 0;
  }

  for(i = 0; i < ETcp.ETcp.length; i++){
    ETca[i] = Ks[i]*ETcp.ETcp[i];
  }

  //console.log(ETca);

  return(ETca);

  }
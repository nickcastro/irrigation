import KcTable from '../components/json/KcTable.json'
import SoilTable from '../components/json/Soils.json'

export default function Ke(irrigation, weather, ETo, ETca, crop, soil, plantDate, kcb, waterDeficit_a, availableWater){
   

  //**************************************
  // 
  //  Set All Variables
  //
  //**************************************

    
   //var newVals = {};  


  for(var i = 0; i < KcTable.length; i++){
    if(KcTable[i].Crop == crop){
      var myCrop = KcTable[i];
    }
  }

  for(i = 0; i < SoilTable.length; i++){
    if(SoilTable[i].Texture == soil){
      var mySoil = SoilTable[i];
    }
  }

/*

  //soil profile information 
  // comes from where ? (will this vary by soil type?)
  var dz = 0.3  // Depth increment for soil moisture measurements(m), 0.30 m = 1 ft
  var sm_depths = 10 // number of soil moisture measurement depths
  var Ze = 0.1; // soil depth subjected to evaporation

  var Rz_depths = 0;
  var Rz_remains = 0;
  var Total_asm = 0;
  var Total_fr = 0;
  var Fr_asm = [];
  var available_sm = [];
  var Fr_roots = [];
  var sm = [];
  var Depletion = [];
  var sum_depl;
  var sum_Rz_depl;
  var Ks_tmp;
  var Transp_dry;
  var ETc_dry;
  var ET_layer = [];
  var Transp_dry_s = [];
  var T_w_input;
  var w_left;
  var w_input = [];
  var nlayers;
  var sum_w;
  var Dpercolation_Rz;
  var Total_sm_Rz;
  var sm_Rz;
  var AW_Rz;
  var DW_Rz;
  var P_actual;
  var RAW_RZ_P_calc;          
  var P_diff_a_c;
  var Rz_depths_max_i;
  var Tot_sm_Rz_max;
  var Cum_ET_dry = Cum_ET_dry + ETc_dry
  //var Cum_ET_wet = Cum_ET_wet + ETc_wet
  var Cum_W_R_irr;
  var Cum_rain;
  var Cum_irrig;
  var Cum_transp;
  var Cum_evap;
  var Cum_dperc;
  var TAW_Rz;
  var RAW_Rz;
  var Fr_extract = [];

  // initialize soil moisture array
  // why 366 ?
  for(i = 0; i < 366; i++){
    for(var j = 1; j < sm_depths; j++){
      sm[i] = {i: 0, depth: 0};
      Depletion[i] = {i: 0, depth: 0};
    }
  }*/


  //console.log(myCrop);

  var aw = availableWater.Taw;

  var hmax = Number(myCrop.hMax);
  var Rzmax = Number(myCrop.Rzmax)*0.0254; // convert from in to m
  var h = [];
  var Rz = [];
  var day_maxHeight = Number(myCrop.L1) + Number(myCrop.L2);
  // revisit crop specific emergence
  var day_emergence = 5;
  var slopeH = hmax/(day_maxHeight-day_emergence);
  var slopeRz = Rzmax/(day_maxHeight-day_emergence);

  var REW = Number(mySoil.REW);
  var TEW = Number(mySoil.TEW);

  var RAW_Rz = [];
  var TAW_Rz = [];

  var TimeStamp = "T00:00:00";
  var plantDateFormatted = new Date(plantDate + TimeStamp);

  var newWeather = [];
  var precipitation_mm = [];
  var irrAmount_mm = [];
  var waterDeficit_mm = [];
  var Kcmax = [];

  var evaporation = [];
  var transpiration_p = [];
  var transpiration_a = [];


  var ETo_mm = [];
  var ETc = [];
  var ETc_adj = [];

  var ETc_in_p = [];
  var ETc_in_a = [];

  var sumETca = 0;
  var sumETcp = 0;

  var sumTca = 0;
  var sumTcp = 0;

  var count = 0;
  for(i = 0; i < weather.length; i++){
    var weatherDate = new Date(weather[i].the_date+TimeStamp);
    if(weatherDate.getTime() > plantDateFormatted.getTime()){
      newWeather[count] = weather[i];
      //convert in to mm
      precipitation_mm[count] = weather[i].precipitation * 25.4;
      count++;
    }
  }

  for(i = 0; i < irrigation.Date.length; i++){
    // convert in to mm
    irrAmount_mm[i] = irrigation.Amount[i]*25.4; 
  }

  var addedWater_mm = [];

  for(i = 0; i < irrigation.Date.length; i++){
    addedWater_mm[i] = precipitation_mm[i] + irrAmount_mm[i];
  }

  /*for(i = 0; i < waterDeficit_a.length; i++){
    // convert in to mm
    waterDeficit_mm[i] = waterDeficit_a[i]*25.4; 
  }*/

  count = 0;
  for(i = 0; i < ETo.Date.length; i++){
    var date = new Date(ETo.Date[i]+TimeStamp);
    if(date.getTime() > plantDateFormatted.getTime()){
      //filter ETo by dates > plantDate and convert from in to mm
      ETo_mm[count] = ETo.ETo_in[i]*25.4;
      count++;
    }
  }

  // calculate avg wind speed and avg relative humidity
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


  // calculate crop height 'h' for growing season
  for(i = 0; i < ETca.length; i++){
    
    if(i <= day_emergence){
      h[i] = 0;
      Rz[i] = 0.1016;
    }
    else if(i > day_emergence && i < day_maxHeight){
      h[i] = (i - day_emergence) * slopeH;
      Rz[i] = (i - (day_emergence - 1)) * slopeRz + 0.1016;
    }
    else{
      h[i] = hmax;
      Rz[i] = Rzmax + 0.1016;
    }
      
    Kcmax[i] = Math.max( (1.2 + ( 0.04 * (u2-2) - 0.004 * (hmd_avg-45) ) * Math.pow(h[i]/3,0.3)), (kcb[i]+0.05));
    TAW_Rz[i] = 1000 * mySoil["(FC-PWP)"] * Rz[i]; // units: mm
    RAW_Rz[i] = myCrop.MAD * TAW_Rz[i]; // units mm

    }

    //console.log(h);
    //console.log(Rz);
    //console.log(TAW_Rz);
    //console.log(RAW_Rz);

    //top soil layer water balance (depletion)
    var De_start = [];
    De_start[0] = 0;
    var De_end = [];

    // soil water balance for root zone (depletion)
    var Dr_start = [];
    // intitial amount at ~4 inch depth root zone
    Dr_start[0] = 1000 * mySoil["(FC-PWP)"] * 0.1016;
    var Dr_end = [];

    var Dr_diff = [];

    // soil moisture in profile
    var soilMoisture = [];
    
    var kr = [];
    var ke_vector = []; // kcb + ke
    var ke = []; // just ke
    var ks = []; // transpiration reduction factor
    
    var stage = [];
    
    // F_w and F_ew will change based on conditions, for now 1
    var f_ew = [];
    var f_w = [];
    var f_c = [];
    
    var runOff = [];
    var DPe_s = [];
    var DP_rz = [];
    
    // calculate f_c from Eq(76)
    for(i = 0; i < ETca.length; i++){
      if(i < day_emergence || i >= myCrop.Total){
        f_c[i] = 0;
      } else {
        f_c[i] = Math.pow( ((kcb[i] - myCrop.Kcbi)/(Kcmax[i] - myCrop.Kcbi)), (1 + 0.5*h[i]) );
      }
    }

    //console.log(f_c);
    
    //
    //
    //
    // most always 1 ?
    // might be the problem, value will limit kcmax
    // should be values between [0.01,1]
    //
    //
    f_w[0] = 0;
    for(i = 1; i < ETca.length; i++){
      if(irrAmount_mm[i] > 0 && precipitation_mm[i] < 3){
        f_w[i] = 0;
      } 
      else if(irrAmount_mm[i] > 0 && precipitation_mm[i] >= 3){
        f_w[i] = 1;
      }
      else if(irrAmount_mm[i] == 0 && precipitation_mm[i] >= 3){
        f_w[i] = 1;
      } 
      else {
        f_w[i] = f_w[i-1];
      }
    }

    //console.log(f_w);
    
    for(i = 0; i < ETca.length; i++){
      f_ew[i] = Math.min(1 - f_c[i], f_w[i]);
    }

    //console.log(f_ew);

    // TEw = 0 unless Rzmax > 0.55 (0 unless very small crop..)
    var TE_w = 0;
    var updateKe = false;

  // check var assignments:
  // seems ok..
 
  
  //console.log(h);
  //console.log(day_maxHeight);
  //console.log(slopeH);
  //console.log(REW);
  //console.log(TEW);
  //console.log(precipitation_mm);
  //console.log(irrAmount_mm);
  //console.log(waterDeficit_mm);
  //console.log(u2);
  //console.log(hmd_avg);
  //console.log(ETo_mm);
  //console.log(Kcmax);
  //console.log(f_w);
  //console.log(f_ew);
  

  


/*
  when watter added to soil profile, assuming water added = TEW 
  this is not the case, need water balance for soil layer
  water balance = water added - evap (not TEW)
  should resolve ke spikes = to kcmax
*/

    
    //**************************************
    // 
    //  Begin Main Loop
    //
    //**************************************

    for(i = 0; i < ETca.length; i++){

      // Ch. 7 - Precipitiation and RunOff
      // Daily precipitation in amounts less than about 0.2 ETo is normally entirely evaporated 
      // and can usually be ignored in the Ke and water balance calculations.
      //console.log("water for day:");
      //console.log(precipitation_mm[i]+irrAmount_mm[i]);
      //console.log(".2 of ETo");
      //console.log(0.2*ETo_mm[i]);
      if((precipitation_mm[i] + irrAmount_mm[i]) > 0.2 * ETo_mm[i]){
        updateKe = true;
        //console.log("updateKe set to true");
      }
      
      //console.log("update ke?");
      //console.log(updateKe);
      if(updateKe){

      //###################################################################################################################
      // The amount of rainfall lost by runoff depends on: 
      // the intensity of rainfall; 
      // the slope of land; 
      // the soil type, hydraulic conditions and antecedent moisture content;
      // the land use and cover. 
      //  
      // For general situations, ROi can be assumed to be zero or can be accounted for by considering only a certain percentage
      // of Pi. This is especially true for the water balance of the topsoil layer, since almost all precipitation events that 
      // would have intensities or depths large enough to cause runoff would probably replenish the water content of the topsoil 
      // layer to field capacity. 
      // ** Therefore, the impact of the runoff component can be ignored. 
      // ** Light precipitation events will generally have little or no runoff.
      // ?
      //###################################################################################################################
    
    // CN: Hydrologic soil group 'B' (moderately low run off potential) for 'good' hydrologic condition of straight row crops
        var CNtmp = 78; 
        // ensure correctness
        runOff[i] = Math.max( ((precipitation_mm[i] + irrAmount_mm[i] - Math.pow(0.2*((1000/78)-10))),2) / (precipitation_mm[i] + irrAmount_mm[i] + 0.8*((1000/78)-10)), 0);
        
        //print(runOff[i])
        

        // Calculate kr under deficit irrigation

        // stage 1
        //console.log("stage 1 check values, De_start and REW:");
        //console.log(De_start[i]);
        //console.log(REW);
        if(De_start[i] <= REW){
          //print("stage 1")
          //print(De_start)
          stage[i] = 1;
          kr[i] = 1;
        }
        // stage 2
        else if(De_start[i] > REW && De_start[i] <= TEW){
          //console.log("stage 2");
          //print(De_start)
          // eq 74
          stage[i] = 2;
          kr[i] = (TEW - De_start[i])/(TEW-REW);
        }
        // no evap
        else{
          //print("updateKe, kr back to 0")
          //console.log("kr back to 0");
          kr[i] = 0;
          stage[i] = 0;
        }
      
        ke_vector[i] = Math.min(kr[i] * (Kcmax[i] - kcb[i]), Kcmax[i] * f_ew[i]) + kcb[i];
        ke[i] = Math.min(kr[i] * (Kcmax[i] - kcb[i]), Kcmax[i] * f_ew[i]);
        
        // different from book ?
        //DPe_s[i] = Math.max(precipitation_mm[i] + irrAmount_mm[i] * f_w[i] - De_start[i], 0);
        DPe_s[i] = Math.max(precipitation_mm[i] - runOff[i] + irrAmount_mm[i] * f_w[i] - De_start[i], 0);

        //console.log(DPe_s);

        // calculate evaporation/transpiration components to include in soil depletion
        
        /*evaporation_p[i] = ke_vector[i] * ETo_mm[i];
        if(Rz[i] == 0){
          transpiration[i] = 0;
        }else {
          transpiration[i] = kcb[i] * ETo_mm[i];
        }*/

        evaporation[i] = ke[i] * ETo_mm[i];
        if(Rz[i] == 0){
          transpiration_p[i] = 0;
        }else {
          transpiration_p[i] = kcb[i] * ETo_mm[i];
        }

        // soil depletion from book Eq.77
        // different from book ?
        
        De_end[i] = De_start[i] + evaporation[i] - precipitation_mm[i] - (irrAmount_mm[i] * f_w[i]) + DPe_s[i] + transpiration_p[i];
        De_start[i+1] = De_end[i];

        //print(ke[i])
        
        // reset soil depletion if depletion is reached
        if(kr[i] == 0){
          //console.log("updateKe back to false");
          updateKe = false;
          De_start[i+1] = 0;
        }
        
      } // end if updateKe
      else {
        //console.log("=kcb");
        kr[i] = 0;
        ke_vector[i] = kcb[i];
        ke[i] = kcb[i];
        evaporation[i] = ke[i] * ETo_mm[i];
        if(Rz[i] == 0){
          transpiration_p[i] = 0;
        }else {
          transpiration_p[i] = kcb[i] * ETo_mm[i];
        }
        //console.log(ke_vector[i]);
        //console.log(kcb[i]);
        De_end[i] = 0;
        De_start[i+1] = 0;
        DPe_s[i] = 0;
        stage[i] = 0;
        runOff[i] = 0;
      }

      ETc[i] = evaporation[i] + transpiration_p[i];

      ETc_in_p[i] = (evaporation[i] + transpiration_p[i])*0.0393701;

      if(Dr_start[i] > 0){
        DP_rz[i] = 0;
      } else {
        DP_rz[i] = precipitation_mm[i] - runOff[i] + irrAmount_mm[i] - Dr_start[i] - ETc[i];
      }

      if(DP_rz[i] < 0)
          DP_rz[i] = 0;
       

      // calculate soil water depletion of root zone
      Dr_end[i] = Math.max(Dr_start[i] - precipitation_mm[i] - runOff[i] - irrAmount_mm[i] + ETc[i] + DP_rz[i], 0);
      Dr_start[i+1] = Dr_end[i];


      if(Dr_end[i] > RAW_Rz[i]){
        ks[i] = (TAW_Rz[i] - Dr_end[i])/(TAW_Rz[i] - RAW_Rz[i]);
      } else {
        ks[i] = 1;
      }

      if(ks[i] < 0)
        ks[i] = 0;

      // etc from mm to in
      ETc_adj[i] = (ks[i]*kcb[i]+ke[i])*ETo_mm[i]*0.0393701;

      transpiration_a[i] = (ks[i]*kcb[i])*ETo_mm[i];

      ETc_in_a[i] = (transpiration_a[i] + evaporation[i])*0.0393701;

      //soilMoisture not right..?
      if(i == 0){
        //soilMoisture[i] = (aw[i]*25.4) - Dr_start[i];
        Dr_diff[0] = Dr_end[i] - Dr_start[i];
        soilMoisture[i] = TAW_Rz[i] - Dr_diff[0];
        //soilMoisture[i] = Dr_end[i];
      }
      else{
        Dr_diff[i] = Dr_end[i] - Dr_end[i-1];
        //console.log(Dr_diff);
        //console.log(TAW_Rz[i]);
        //console.log(soilMoisture[i-1]);

        soilMoisture[i] = soilMoisture[i-1] - Dr_diff[i] + (TAW_Rz[i] - TAW_Rz[i-1]);
      }


  } // end main loop

  for(i = 0; i < ETo_mm.length; i++){
    sumTca += transpiration_a[i];
    sumTcp += transpiration_p[i];
  }



  //*************************************
  //  Testing Resulting Variables
  //************************************


  //console.log(sumTca);
  //console.log(sumTcp);

  //console.log(transpiration_a);
  //console.log(transpiration_p);

  //console.log(evaporation);
  //console.log(ETc_in_a);
  //console.log(ETc_in_p);
  //console.log(ks);
  //console.log(Dr_diff);
  //console.log(soilMoisture);
  //console.log(Dr_start);
  //console.log(TAW_Rz);
  //var testing = {sm: soilMoisture, start: Dr_start, end: Dr_end};
  //console.log(testing);

  //console.log(runOff);
  //console.log(ETc_adj);
  //console.log(ETc);
  //console.log(TAW_Rz);
  //console.log(RAW_Rz);
  //console.log(ks);
  
  //console.log(Dr_start);
  //console.log(Dr_end);
  //console.log(DP_rz);

  //console.log(ke_vector);

  var toReturn = {
    weather: newWeather,
    ke: ke_vector, 
    water: addedWater_mm, 
    precipitation: precipitation_mm,
    irrigation: irrAmount_mm,
    De_start: De_start, 
    De_end: De_end,
    stage: stage, 
    kr: kr, 
    Kcmax: Kcmax,
    F_ew: f_ew,
    f_c: f_c,
    f_w: f_w,
    evap: evaporation,
    transp: transpiration_p,
    DPe: DPe_s,
    DP_rz: DP_rz,
    ETc_final: ETc_adj,
    runOff: runOff,
    sm: soilMoisture,
    transpiration_a: transpiration_a,
    ETc_in_a: ETc_in_a,
    ETc_in_p: ETc_in_p,
    sumTca: sumTca,
    sumTcp: sumTcp,
    ETo_mm: ETo_mm,
    TAW_Rz: TAW_Rz,
    RAW_Rz: RAW_Rz,
    ks: ks,
    Dr_end: Dr_end,
    Dr_diff: Dr_diff
  };

    //console.log(toReturn);

  /*
    
    toReturn <- cbind(seq(1, length(ETc), 1),
                              precipitation+irr$Amount,
                              head(De_start,-1), 
                              stage, 
                              kr,
                              Kcmax,
                              ke,
                              ke*ETo,
                              De_end,
                              f_ew,
                              f_c,
                              f_w)

    
    colnames(toReturn) <- c("day", 
                            "precipitation + irrigation", 
                            "De_start", 
                            "stage",
                            "kr",
                            "kcmax",
                            "ke",
                            "ke*ETo",
                            "De_end",
                            "f_ew",
                            "f_c",
                            "f_w")
    
    return(toReturn)
  */

  return(toReturn);

}
export default function ETo(allwd) {

  //console.log(allwd);

    var Tmin_C = [];
    var Tmax_C = [];
    var RH = [];
    var Rs_MJ = [];
    var u_ms = [];
    var Latitude = [];
    var Elevation = [];
    var DOY = [];
    var the_date = [];
    var u2 = [];
    var Ta = [];
    var Atm_Pressure = [];
    var Psy_Constant = [];
    var Delta = [];
    var eo_TmaxC = [];
    var eo_TminC = [];
    var es = [];
    var ea = []; 
    var Vpd = [];
    var Latitude_r = [];
    var dr = [];
    var declination = [];
    var x = [];
    var Ws = [];
    var Ra = [];
    var Rso = [];
    var Rs_Rso = [];
    var TmaxK = [];
    var TminK = [];
    var Rnl = [];
    var Rns = [];
    var Rn = [];
    var ETos_mm = [];
    var ETos_in = [];
    var ETrs_mm = [];
    var toReturn = {};


  var Zw = 1.71;
  var Lhv = 2.45;         //Latent heat of vaporization (MJ/kg)
  var Cn_grass = 900;     //constants used in eq(1) for daily calculation of ET for grass and alfalfa
  var Cd_grass = 0.34;    //taken from EWRI table (1)
  var Cn_alf = 1600;
  var Cd_alf = 0.38;
  var G = 0;              // soil heat flux is assumed negligible for daily calculations

  // Calculate Rn **************/
  var Pi = 3.1416;
  var albedo = 0.23;
  var Gsc = 4.92;   //solar constant (MJ/m2/hr)
  var Sbc = (4.901 * Math.pow(10,-9)); //Stefan-Boltzmann constant (MJ K-4 m-2 d-1)
  /*****************************/

  // iterate through all weather days
  for(let i=0; i<allwd.length; i++){

    Tmin_C[i] = (allwd[i].tmin-32)*(5/9);
    Tmax_C[i] = (allwd[i].tmax-32)*(5/9);
    RH[i] = allwd[i].relative_humidity;
    Rs_MJ[i] = allwd[i].solar_radiation;
    u_ms[i] = allwd[i].wind_mph;
    Latitude[i] = allwd[i].lat;
    Elevation[i] = allwd[i].elevation;

    the_date[i] = allwd[i].the_date;
    var d = new Date(allwd[i].the_date);
    //d.setHours(0,0,0,0);
    var yn = d.getFullYear();
    var mn = d.getMonth();
    var dn = d.getDate();
    var d1 = new Date(yn,0,1,12,0,0); // noon on Jan. 1
    var d2 = new Date(yn,mn,dn,12,0,0); // noon on input date
    var ddiff = Math.round((d2-d1)/864e5);
    DOY[i] = ddiff+1;

  //*****************************************
  // Convert units to international system
  //*****************************************

    u2[i] = u_ms[i] * (4.87 / (Math.log(67.8 * Zw - 5.42)));   // Wind speed at 2m height
    Ta[i] = (Tmax_C[i] + Tmin_C[i]) / 2;                           //Average air temperature
    Atm_Pressure[i] = 101.3 * ((293 - 0.0065 * Elevation[i]) / 293) ^ 5.26; //Mean atmospheric pressure (kPa)
    Psy_Constant[i] = 0.000665 * Atm_Pressure[i];          // Psychrometric constant (kPa/C)
    Delta[i] = (2504 * Math.exp(17.27 * Ta[i]/(Ta[i]+237.3))) / Math.pow((Ta[i] + 237.3), 2);
    eo_TmaxC[i] = 0.6108 * Math.exp(17.27 * Tmax_C[i]/ (Tmax_C[i] + 237.3));
    eo_TminC[i] = 0.6108 * Math.exp(17.27 * Tmin_C[i] / (Tmin_C[i] + 237.3));
    es[i] = (eo_TmaxC[i] + eo_TminC[i]) / 2;            // Saturation vapor pressure (kPa)
    ea[i] = RH[i] * es[i] / 100;                              // Actual vapor pressure (kPa)
    Vpd[i] = es[i] - ea[i];                             //Vapor pressure deficit (kPa)
    Latitude_r[i] = Latitude[i] * 3.1416 / 180;           //Convert latitude to radians



    dr[i] = 1 + 0.033 * Math.cos(2 * Pi * DOY[i]/365); //relative distace earth to sun, eq (23)
    declination[i] = 0.409 * Math.sin((2 * Pi * DOY[i]/ 365) - 1.39); //solar declination, eq (24)
  
    x[i] = 1 - Math.pow((Math.tan(Latitude_r[i])),2) * Math.pow((Math.tan(declination[i])),2);
  
  for(let j = 0; j < x.length; j++){
    if (x[j] <= 0)
      x[i] = 0.00001;
    }
  
  Ws[i] = (Pi / 2) - Math.atan(-Math.tan(Latitude_r[i]) * Math.tan(declination[i]) / Math.pow(x[i],0.5) ); //Sunset hour angle, eq(28)
  
 //Extraterrestrial radiation, eq (21)
  
  Ra[i] = (24 / Pi) * Gsc * dr[i] * (Ws[i] * Math.sin(Latitude_r[i]) * Math.sin(declination[i]) + Math.cos(Latitude_r[i]) * Math.cos(declination[i]) * Math.sin(Ws[i]));
  Rso[i] = (0.75 + 2 * Math.pow(10,-5) * Elevation[i]) * Ra[i];               //Clear sky solar radiation, Eq(19)
  
  Rs_Rso[i] = Rs_MJ[i] / Rso[i];
  
  TmaxK[i] = Tmax_C[i] + 273.16; //Covert temperatures to Kelvin
  TminK[i] = Tmin_C[i] + 273.16;
  
  //Rnl is Long-wave net radiation, eq (18)
  Rnl[i] = Sbc * ( ( Math.pow(TmaxK[i],4) + Math.pow(TminK[i],4) ) / 2) * (0.34 - 0.14 * Math.pow(ea[i],0.5)) * (1.35 * (Rs_Rso[i]) - 0.35);
  
  
  //Rns is short-wave net radiation, eq (16)
  Rns[i] = (1 - albedo) * Rs_MJ[i];
  Rn[i] = Rns[i] - Rnl[i];        //net radiation (Mj m-2 d-1), eq(15)
  
  
  ETos_mm[i] = (0.408 * Delta[i] * (Rn[i] - G) + Psy_Constant[i] * (Cn_grass * u2[i] * Vpd[i]) / (Ta[i] + 273)) / (Delta[i] + Psy_Constant[i] * (1 + Cd_grass * u2[i]));
  ETrs_mm[i] = (0.408 * Delta[i] * (Rn[i] - G) + Psy_Constant[i] * (Cn_alf * u2[i] * Vpd[i]) / (Ta[i] + 273)) / (Delta[i] + Psy_Constant[i] * (1 + Cd_alf * u2[i]));
  
  ETos_in[i] = ETos_mm[i]/25.4;

  }

  toReturn = {Date: the_date, DOY: DOY, ETo_in: ETos_in, ETo_mm: ETos_mm};
    
  //checking resulting variables

  /*
  console.log(ETo);
  console.log(Ta);
  console.log(Atm_Pressure);
  console.log(Psy_Constant);
  console.log("delta");
  console.log(Delta);
  console.log(eo_TmaxC);
  console.log(eo_TminC);
  console.log(es);
  console.log(ea);
  console.log(Vpd);
  console.log(DOY);
  console.log(Tmin_C);
  console.log(Tmax_C);
  console.log(RH);
  console.log(Rs_MJ);
  console.log(u_ms);
  console.log(Latitude);
  console.log(Elevation);
*/


  return(toReturn);

  }
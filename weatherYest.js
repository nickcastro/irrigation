//server.js
'use strict'

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//db config -- REPLACE USERNAME/PASSWORD WITH YOUR OWN
mongoose.connect('mongodb://138.197.117.185:27017/myDatabase',{
  useMongoClient: true,
  /* other options */
});

//console.log(mongoose.connection.readyState);

var db = mongoose.connection;

var request = require("request")

function getJSON(url, callback) {
  request({
    url: url,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      callback(body);
    }
  });
}

getJSON('http://api.wunderground.com/api/6140415180133923/yesterday/conditions/q/pws:KSCBLACK8.json', function (body) {
  console.log('we have the body!', body);
});


/*
db.weather.insert( { 
  item: "card", 
  qty: 15
  } )
*/

/*
the_date, 
lat, 
lon, 
elevation, 
city,
county, 
station_id, 
tavg, 
tmin,
tmax,
relative_humidity, 
dewpoint_humidity, 
precipitation, 
wind_mph, 
solar_radiation
*/


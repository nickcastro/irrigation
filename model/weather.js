//model/comments.js
'use strict';
//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create new instance of the mongoose.schema. the schema takes an object that shows
//the shape of your database entries.
var WeatherSchema = new Schema({
	the_date: String,
	lat: Number,
	lon: Number,
	elevation: Number,
	county: String,
	city: String,
	tmax: Number,
	tmin: Number,
	tavg: Number,
	relative_humidity: Number,
	dewpoint_humidity: Number,
	precipitation: Number,
	wind_mph: Number,
	solar_radiation: Number}, 
	{ collection : 'weather' });

//export our module to use in server.js
module.exports = mongoose.model('Weather', WeatherSchema);
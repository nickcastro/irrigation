//server.js
'use strict'

//first we import our dependencies...
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Field = require('./model/fields');
var Weather = require('./model/weather');
var Active = require('./model/active');

//db config -- REPLACE USERNAME/PASSWORD WITH YOUR OWN
mongoose.connect('mongodb://localhost:27017/myDatabase');

var db = mongoose.connection;

//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.API_PORT || 3001;

//now we should configure the APi to use bodyParser and look for JSON data in the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now  we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});


//adding the /weather route to our /api router
/*router.route('/active')

  //retrieve all weather from the database
  .get(function(req, res) {
    //looks at our weather Schema
    Active.find(function(err, active) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(active)
    });
  })

    //post new comment to the database
  .post(function(req, res) {
    var active = new Active();
    (req.body.uid) ? active.uid = req.body.uid : null;
    (req.body.FieldName) ? active.FieldName = req.body.FieldName : null;
    (req.body.crop) ? active.crop = req.body.crop : null;
    (req.body.location) ? active.location = req.body.location : null;
    (req.body.soil) ? active.soil = req.body.soil : null;
    (req.body.plantDate) ? active.plantDate = req.body.plantDate : null;

	var query = {'uid':req.body.uid};
	var upsertData = active.toObject();
	delete upsertData._id;
	//req.newData.FieldName = req.body.FieldName;
	Active.findOneAndUpdate(query, upsertData, {upsert:true}, function(err, doc){
    	if (err) return res.send(500, { error: err });
    	return res.send("succesfully saved");
	});
  })

router.route('/active/:uid')

   //retrieve all comments from the database
  .get(function(req, res) {
    //looks at our Comment Schema
    Active.find({ uid: req.params.uid }, function(err, field) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(field)
    });
  })*/


//adding the /weather route to our /api router
router.route('/weather')

  //retrieve all weather from the database
  .get(function(req, res) {
    //looks at our weather Schema
    Weather.find(function(err, weather) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(weather)
    });
  })


router.route('/weather/:city')

   //retrieve all comments from the database
  .get(function(req, res) {
    //looks at our Comment Schema
    Weather.find({ city: req.params.city }, function(err, weather) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(weather)
    });
  })


//doing something wrong here..
/*
router.route('/weather/:city/:date')

   //retrieve all comments from the database
  .get(function(req, res) {
    //looks at our Comment Schema
    Weather.find({$and: [ { city: req.params.city}, {date: { $gte : req.params.date } } ]}, function(err, weather) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(weather)
    });
  })
*/

//adding the /comments route to our /api router
router.route('/fields')

  //retrieve all comments from the database
  .get(function(req, res) {
    //looks at our Comment Schema
    Field.find(function(err, fields) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(fields)
    });
  })


  //post new field to the database
  .post(function(req, res) {
    var field = new Field();
    (req.body.uid) ? field.uid = req.body.uid : null;
    (req.body.FieldName) ? field.FieldName = req.body.FieldName : null;
    (req.body.crop) ? field.crop = req.body.crop : null;
    (req.body.location) ? field.location = req.body.location : null;
    (req.body.soil) ? field.soil = req.body.soil : null;
    (req.body.plantDate) ? field.plantDate = req.body.plantDate : null;
    field.isActive = true;
    (req.body.irrigation) ? field.irrigation = req.body.irrigation : null;


    field.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Field successfully added!' });
    });
  });

router.route('/fields/active/:uid')

   //retrieve all comments from the database
  .get(function(req, res) {
    //looks at our Comment Schema
    Field.find({ 
    	$and: [ { isActive: true }, { uid: req.params.uid } ] }, 
    	function(err, field) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(field)
    });
  })

   //retrieve all comments from the database
  .put(function(req, res) {
    //looks at our Comment Schema
    //const update = _.assign({ "isActive": true }, req.body);
    Field.findOne({ 
    	$and: [ { isActive: true }, { uid: req.params.uid } ] }, 
    	function(err, field) {
    	field.isActive = false;	
      	if (err)
        	res.send(err);
      	//responds with a json object of our database comments.
        field.save(function (err) {
        	if(err) 
            	console.error('ERROR!');
        	res.json({ message: 'Active field successfully updated!' });
    	});
    });
  })


router.route('/fields/:field_id')

//The put method gives us the chance to update our comment based on the ID passed to the route
 .put(function(req, res) {
   Field.findById(req.params.field_id, function(err, field) {

     if (err)
       res.send(err);
     //setting the new author and text to whatever was changed. If nothing was changed
     // we will not alter the field.
     (req.body.uid) ? field.uid = req.body.uid : null;
     (req.body.FieldName) ? field.FieldName = req.body.FieldName : null;
     (req.body.crop) ? field.crop = req.body.crop : null;
     (req.body.location) ? field.location = req.body.location : null;
     (req.body.soil) ? field.soil = req.body.soil : null;
     (req.body.plantDate) ? field.plantDate = req.body.plantDate : null;
     (req.body.isActive) ? field.isActive = req.body.isActive : null;
     (req.body.irrigation) ? field.irrigation = req.body.irrigation : null;

     //save comment
     field.save(function(err) {
       if (err)
         res.send(err);
       res.json({ message: 'Field has been updated' });
     })
   })
 })

 //delete method for removing a comment from our database
 .delete(function(req, res) {
   //selects the comment by its ID, then removes it.
   Field.remove({ _id: req.params.field_id }, function(err, field) {
     if (err)
       res.send(err);
     res.json({ message: 'Field has been deleted' })
   })
 })

   //retrieve all comments from the database
  .get(function(req, res) {
    //looks at our Comment Schema
    Field.findById(req.params.field_id, function(err, field) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(field)
    });
  })

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
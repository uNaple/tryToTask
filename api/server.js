"use strict"

var config 	= require('../config/config.js'),
		express = require('express'),
		app 		= express(),
		path		= require('path'),
		bodyParser 	= require('body-parser'),
		db = require('../modules/db');
var http = require('http');
var url = require('url');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.set('view engine', 'jade');
app.set('views', '../views');
app.use(express.static(path.join(__dirname,'../public')));
app.use(logErrors);

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}


app.listen(config.api.http, function() {
	console.log('APP listening on port ' + config.api.http.port);
 });

app.get('/', function (req, res) {
  res.render('index', {
  						title: 		'tm',
  });
  // res.send('Hello World!');
});

app.get('/test', function (req, res) {
	// console.log('req task with id=',req.query.id);
	db.getTasks(function(err, result) {
		if(err) {
			res.send(err);
		} else {
			res.send(JSON.stringify(result));
		}
	})
})

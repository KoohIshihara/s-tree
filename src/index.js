/*
 * server.js
 */

var express = require('express');
var path = require('path');
var logger = require('morgan');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));

app.set('port', process.env.PORT || 3081);

app.use(require('less-middleware')(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});


var express     = require('express');
var http        = require('http');
var nodemailer  = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var app         = express();
var dbPath      = 'mongodb://localhost/myAppLkUs';
var fs          = require('fs');
var events      = require('events');

// Create an http server
app.server      = http.createServer(app);

// Create an event dispatcher
var eventDispatcher = new events.EventEmitter();
app.addEventListener = function ( eventName, callback ) {
  eventDispatcher.on(eventName, callback);
};
app.removeEventListener = function( eventName, callback ) {
  eventDispatcher.removeListener( eventName, callback );
};
app.triggerEvent = function( eventName, eventOptions ) {
  console.log('Entrando al trigger Event');
  eventDispatcher.emit( eventName, eventOptions );
};

// Create a session store to share between methods
app.sessionStore = new MemoryStore();

// Import the data layer
var mongoose = require('mongoose');
var config = {
  mail: require('./config/mail')
};

// Import the models
var models = {
  Account: require('./models/Account')(app, config, mongoose, nodemailer),
  Professions : require('./models/Professions')(app, config, mongoose, nodemailer)

};

app.configure(function(){
  app.sessionSecret = 'lkUsSocial';
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: app.sessionSecret,
    key: 'express.sid',
    store: app.sessionStore
  }));
  mongoose.connect(dbPath, function onMongooseError(err) {
    if (err) throw err;
  });
});

// Import the routes
fs.readdirSync('routes').forEach(function(file) {
  if ( file[0] == '.' ) return;
  var routeName = file.substr(0, file.indexOf('.'));
  require('./routes/' + routeName)(app, models);
});

app.get('/', function(req, res){
  res.render('index.jade');
});



// New in Chapter 9 - the server listens, instead of the app
app.server.listen(8080);
console.log("SocialNet is listening to port 8080.");

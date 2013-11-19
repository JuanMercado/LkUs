var express     = require('express');
var http        = require('http');
var nodemailer  = require('nodemailer');
var MemoryStore = require('connect').session.MemoryStore;
var app         = express();
var dbPath      = 'mongodb://localhost/myAppLkUs';
var fs          = require('fs');
var events      = require('events');
var fb          = require('facebook-js');
var fbId        = '564141750329309';
var fbToken     = '3b719625fef72f140395c93bc1cfdb4e';
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
  //Facebook : require('./models/Facebook')(app, config, mongoose, nodemailer,fb)
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

app.get('/loginfacebook', function(req,res){
  console.log('trying to login:' + new Date());
  res.redirect(fb.getAuthorizeUrl({
        client_id: fbId, //put the client id
        redirect_uri: 'http://localhost:8080/auth/fb', //cambiar si es necesario
        scope: 'user_about_me,user_friends,user_birthday,user_photos,friends_about_me,friends_birthday,friends_photos,email'
    }));
});

app.get('/auth/fb', function(req, res){
  console.log('response from fb: ' + new Date());
    //log.notice('response from fb: ' + new Date());
    fb.getAccessToken(fbId, //clientid
        fbToken, //app secret
        req.param('code'),
        'http://localhost:8080/auth/fb', //cambiar si es necesario
        function (error, access_token, refresh_token) {
            if (error){
              console.log('error getting access token:' + error);
                throw new Error('Error getting the acccess token');
            }
            console.log('trying to get the tokens:' + new Date());
            req.session.user = {};
            req.session.user.access_token = access_token;
            req.session.user.access_token_secret = refresh_token;
            fb.apiCall('GET', '/me/', {access_token: req.session.user.access_token}, function(error, response, body){
                if (error){
                  console.log('error getting user info:' + error);
                    throw new Error('Error getting user information');
                }
                console.log('Data: '+body.friends);
                req.session.user.data = body;
                res.redirect('/#profile/me');
            });
        }
    );
});

// New in Chapter 9 - the server listens, instead of the app
app.server.listen(8080);
console.log("SocialNet is listening to port 8080.");

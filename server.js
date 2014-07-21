'use strict';

// Module dependencies.
var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    path = require('path'),
    fs = require('fs'),
    mongoStore = require('connect-mongo')(express),
    config = require('./server/config/config');

var app = express();

// Connect to database
var db = require('./server/db/mongo').db;

// Bootstrap models
var modelsPath = path.join(__dirname, 'server/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  console.log("Have a look at this, why i get errors if file is .DS_Store? :=>  " + file);
  if (file != ".DS_Store"){
    require(modelsPath + '/' + file);
  }
});

var pass = require('./server/config/pass');

// configuration ===============================================================

app.configure(function() {
  app.use(express.static(path.join(__dirname, 'client')));
  app.use(express.errorHandler());
  app.set('views', __dirname + '/client/views');
  app.use(express.logger('dev'));             // log every request to the console
});

app.configure('production', function(){
  app.use(express.logger('production'));             // log every request to the console
});

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// cookieParser should be above session
app.use(express.cookieParser());

// bodyParser should be above methodOverride
app.use(express.bodyParser());
app.use(express.methodOverride());

// express/mongo session storage
app.use(express.session({
  secret: 'MEAN',
  store: new mongoStore({
    url: config.mongo.db,
    collection: 'sessions'
  })
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

//routes should be at the last
app.use(app.router);

//Bootstrap routes
require('./server/config/routes')(app);

// Setting up Mail Listener
var mailProcessor = require('./server/domain/mail-domain');
var mailListener = require('./server/config/wh-mail-listener')(config.mailing);
mailListener.onMailReceived(mailProcessor.process);
mailListener.start;

// Start server
var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});

if (process.platform !== 'win32') {
  //
  // Signal handlers don't work on Windows.
  //
  process.on('SIGINT', function () {
    console.log('http-server stopped.');
    process.exit();
  });
}
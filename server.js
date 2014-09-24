'use strict';
/* Load .env */
var dotenv = require('dotenv');
dotenv.load();
/*************/

// Module dependencies.
var express = require('express'),
    http = require('http'),
    passport = require('passport'),
    path = require('path'),
    fs = require('fs'),
    mongoStore = require('connect-mongo')(express),
    config = require('./server/config/config');

var app = express();
module.exports = app;

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
  app.set('views', __dirname + '/client');
  app.use(express.logger('dev'));             // log every request to the console
});

app.configure('production', function(){
  app.use(express.static(path.join(__dirname, 'www')));
  app.use(express.errorHandler());
  app.set('views', __dirname + '/www');
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
    // url: config.mongo.db,
    db: db.connection.db,
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

// Mailing
// Global

try {

  global.mailSender = require('./server/config/mail-sender')(config.mailSending); // Mail Sender set up with (SENDGRID)
  // Setting up Mail Listener
  if (!config.mailListening.disabled){
    console.log("########### MAILER ACTIVE #############");

    var MailListener = require('./server/config/mail-listener');
    var mailListener = new MailListener(config.mailListening);

    var MailDomain = require('./server/domain/mail-domain');
    var mailDomain = new MailDomain(global.mailSender)
    
    mailListener.onMailReceived(mailDomain.processIncoming);
    mailListener.start();
  }
}
catch (e){
  console.log("It has been issues setting up the Mailing services.")      
}

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

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

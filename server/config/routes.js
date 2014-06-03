'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function(app) {
  // User Routes
  var users = require('../controllers/users');
  app.post('/auth/users', users.create);
  app.get('/auth/users/:userId', users.show);

  // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.del('/auth/session', session.logout);


  // set up our security to be enforced on all requests to secure paths
  app.all('/api/technician', auth.ensureAuthenticated, auth.ensureTech);
  app.all('/api/admin', auth.ensureAuthenticated, auth.ensureAdmin);


 // Incidence Routes
  var incidences = require('../controllers/incidences');
  app.get('/api/incidences', incidences.all);
  app.post('/api/incidences', auth.ensureAuthenticated, incidences.create);
  app.get('/api/incidences/:incidenceId', incidences.show);
  app.put('/api/incidences/:incidenceId', auth.ensureAuthenticated, auth.incidence.hasAuthorization, incidences.update);
  app.del('/api/incidences/:incidenceId', auth.ensureAuthenticated, auth.incidence.hasAuthorization, incidences.destroy);

  //Setting up the incidenceId param
  app.param('incidenceId', incidences.incidence);

    // Angular Routes
  app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }
    res.render('index.html');
  });

}
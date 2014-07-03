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
  app.delete('/auth/session', session.logout);

  // User Module and Actions Authorizations
  app.get('/auth/rights', auth.ensureAuthenticated, auth.userAuthorization.getRights);

  // Incidence Routes
  var incidences = require('../controllers/incidences');
  app.get('/api/incidences', incidences.all);
  app.post('/api/incidences', auth.ensureAuthenticated, incidences.create);
  app.get('/api/incidences/:incidenceId', incidences.show);
  app.put('/api/incidences/:incidenceId', auth.ensureAuthenticated, incidences.update);
  app.put('/api/incidences/:incidenceId/:property', auth.ensureAuthenticated, incidences.update);
  app.delete('/api/incidences/:incidenceId', auth.ensureAuthenticated, incidences.destroy);

  //Setting up the incidenceId param
  app.param('incidenceId', incidences.incidence);

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }
    res.render('index.html');
  });

}
'use strict';

var path = require('path'),
    auth = require('../controllers/auth'),
    rights = require('../controllers/rights');


module.exports = function(app) {
  // User Routes
  var users = require('../controllers/users');
  app.post('/auth/users', auth.ensureAuthenticatedAsAdmin, users.create);
  app.get('/auth/users/:userId', users.show);
  
  // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);
  // User Module and Actions Rights
  app.get('/auth/rights', auth.ensureAuthenticated, rights.rights);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.delete('/auth/session', session.logout);

   // Service for getting the technicians of the system
  app.get('/api/techs', auth.ensureAuthenticated, users.technicians);

  // Notifications
  var notifications = require('../controllers/notifications');
  app.get('/api/notifications', auth.ensureAuthenticated, notifications.list);

  // Incidence Routes
  var incidences = require('../controllers/incidences');
  app.get('/api/incidences', auth.ensureAuthenticated, incidences.list);
  app.post('/api/incidences', auth.ensureAuthenticated, incidences.create);
  app.get('/api/incidences/:incidenceId', incidences.show);

  // Updating an incidence
  app.put('/api/incidences/:incidenceId', auth.ensureAuthenticated, incidences.update);
  app.put('/api/incidences/:incidenceId/postComment', auth.ensureAuthenticated, incidences.postComment, notifications.comment);
  app.put('/api/incidences/:incidenceId/rate', auth.ensureAuthenticated, incidences.updateRate);
  app.put('/api/incidences/:incidenceId/assign', auth.ensureAuthenticated, incidences.updateAssigned);
  app.put('/api/incidences/:incidenceId/effort', auth.ensureAuthenticated, incidences.updateEffort);
  app.put('/api/incidences/:incidenceId/close', auth.ensureAuthenticated, incidences.close);
  
  app.delete('/api/incidences/:incidenceId', auth.ensureAuthenticated, incidences.destroy);

  //Setting up the incidenceId param
  app.param('incidenceId', incidences.incidence);

  // Users Aministration
  app.get('/api/administration/users', auth.ensureAuthenticatedAsAdmin, users.list);

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }
    res.render('index.html');
  });

}
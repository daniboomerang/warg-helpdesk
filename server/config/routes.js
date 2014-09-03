'use strict';

var path = require('path'),
    auth = require('../controllers/auth');

module.exports = function(app) {

  /////////////////
  // User Routes //
  /////////////////
  var users = require('../controllers/users');

  app.get('/api/users', auth.ensureAuthenticatedAsAdmin, users.list);
  app.get('/api/users/:accountId', users.show);
  //Setting up the userId param
  app.param('accountId', users.user);
  app.post('/auth/users', auth.ensureAuthenticatedAsAdmin, users.create);
  app.get('/auth/users/:userId', users.show);
  // Check if username is available
  // todo: probably should be a query on users
  app.get('/auth/check_username/:username', users.exists);

 
  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.delete('/auth/session', session.logout);

   // Service for getting the technicians of the system
  app.get('/api/techs', auth.ensureAuthenticated, users.technicians);
   // Service for getting the modules of a user
  var modules = require('../controllers/modules');
  app.get('/api/modules', auth.ensureAuthenticated, modules.modules);


  ///////////////////////
  // Notifications API //
  ///////////////////////
  var notifications = require('../controllers/notifications');
  app.get('/api/notifications', auth.ensureAuthenticated, notifications.list);
  app.get('/api/notifications/:notificationId', notifications.show);
  app.put('/api/notifications/:notificationId', auth.ensureAuthenticated);
  app.put('/api/notifications/:notificationId/status', auth.ensureAuthenticated, notifications.status);
  app.param('notificationId', notifications.notification);
  
  ////////////////////
  // Incidences API //
  ////////////////////
  var incidences = require('../controllers/incidences');
  app.post('/api/incidences', auth.ensureAuthenticated, incidences.create);
  app.get('/api/incidences', auth.ensureAuthenticated, incidences.list);
  app.get('/api/incidences/:incidenceId', incidences.show);
  app.put('/api/incidences/:incidenceId', auth.ensureAuthenticated, incidences.update);
  app.put('/api/incidences/:incidenceId/comment', auth.ensureAuthenticated, incidences.comment, notifications.notifyComment);
  app.put('/api/incidences/:incidenceId/rate', auth.ensureAuthenticated, incidences.rate);
  app.put('/api/incidences/:incidenceId/assignee', auth.ensureAuthenticated, incidences.assignee, notifications.notifyAssignee);
  app.put('/api/incidences/:incidenceId/effort', auth.ensureAuthenticated, incidences.effort);
  app.put('/api/incidences/:incidenceId/close', auth.ensureAuthenticated, incidences.close); 
  //app.delete('/api/incidences/:incidenceId', auth.ensureAuthenticated, incidences.destroy);
  //Setting up the incidenceId param
  app.param('incidenceId', incidences.incidence);

  // Schools
  var schools = require('../controllers/schools');
  app.get('/api/schools', auth.ensureAuthenticated, schools.list);
  app.post('/api/schools', auth.ensureAuthenticatedAsAdmin, schools.create);

  // Check if schoolsCode is available
  app.get('/schools/check_schoolcode/:schoolCode', auth.ensureAuthenticatedAsAdmin, schools.exists);

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }
    res.render('index.html');
  });
}  
'use strict';

var path = require('path'),
    auth = require('../controllers/auth');

module.exports = function(app) {
 
  /////////////////
  // Session API //
  /////////////////
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.delete('/auth/session', session.logout);

  /////////////////
  // Modules API //
  /////////////////
  var modules = require('../controllers/modules');
  app.get('/api/modules', auth.ensureAuthenticated, modules.modules);

  /////////////////
  // Schools API //
  /////////////////
  var schools = require('../controllers/schools');
  app.post('/api/schools', auth.ensureAuthenticatedAsAdmin, schools.create);
  app.get('/api/schools', auth.ensureAuthenticatedAsAdmin, schools.list);
  
  // Check if schoolsCode is available
  app.get('/schools/check_schoolcode/:schoolCode', auth.ensureAuthenticatedAsAdmin, schools.exists);

  ///////////////
  // Users API //
  ///////////////
  var users = require('../controllers/users');
  app.post('/api/users', auth.ensureAuthenticatedAsAdmin, users.create);
  app.get('/api/users', auth.ensureAuthenticatedAsAdmin, users.list);
  app.get('/api/users/technicians', auth.ensureAuthenticated, users.technicians);
  app.get('/api/users/:userId', auth.ensureAuthenticatedAsAdmin, users.show);
  app.param('userId', users.user);
  
  // Check if username is available
  app.get('/auth/check_username/:username', users.exists);

  ///////////////////////
  // Notifications API //
  ///////////////////////
  var notifications = require('../controllers/notifications');
  app.get('/api/notifications', auth.ensureAuthenticated, notifications.list);
  app.get('/api/notifications/:notificationId', auth.ensureAuthenticated, notifications.show);
  app.put('/api/notifications/:notificationId', auth.ensureAuthenticated);
  app.put('/api/notifications/:notificationId/status', auth.ensureAuthenticated, notifications.status);
  app.param('notificationId', notifications.notification);
  
  ////////////////////
  // Incidences API //
  ////////////////////
  var incidences = require('../controllers/incidences');
  app.post('/api/incidences', auth.ensureAuthenticated, incidences.create);
  app.get('/api/incidences', auth.ensureAuthenticated, incidences.list);
  app.get('/api/incidences/:incidenceId', auth.ensureAuthenticated, incidences.show);
  app.put('/api/incidences/:incidenceId', auth.ensureAuthenticated, incidences.update);
  app.put('/api/incidences/:incidenceId/comment', auth.ensureAuthenticated, incidences.comment, notifications.notifyComment);
  app.put('/api/incidences/:incidenceId/rate', auth.ensureAuthenticated, incidences.rate);
  app.put('/api/incidences/:incidenceId/assignee', auth.ensureAuthenticated, incidences.assignee, notifications.notifyAssignee);
  app.put('/api/incidences/:incidenceId/effort', auth.ensureAuthenticated, incidences.effort);
  app.put('/api/incidences/:incidenceId/close', auth.ensureAuthenticated, incidences.close); 
  app.param('incidenceId', incidences.incidence);


  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }
    res.render('index.html');
  });
}  
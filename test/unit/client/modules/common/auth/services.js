'use strict';

describe('Service: Auth', function () {

  // load the service's module
  beforeEach(module('authServices'));

  // instantiate service
  var Auth,
    user,
    $rootScope,
    $httpBackend;

  var sessionURL = '/auth/session',
    userURL = '/auth/users';

  beforeEach(inject(function (_Auth_, _$rootScope_, _$httpBackend_) {
    Auth = _Auth_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;

    // mock user
    user = {'email': 'test', 'password':'pass', username:'bob' }
  }));

  it('should login and set global user', function () {
    $httpBackend.expectPOST(sessionURL)
      .respond(user);

    expect($rootScope.currentUser).toBe(null);

    Auth.login('password', user);
    $httpBackend.flush();

    expect($rootScope.currentUser.username).toBe(user.username);
  });

  it('should logout and remove global user', function () {
    $httpBackend.expectDELETE(sessionURL)
      .respond({});

    $rootScope.currentUser = user;
    expect($rootScope.currentUser.username).toBe(user.username);

    Auth.logout();
    $httpBackend.flush();

    expect($rootScope.currentUser).toBe(null);
  });

});
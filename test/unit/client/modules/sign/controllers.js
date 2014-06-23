'use strict';

describe('Controller: SigninCtrl', function () {

  // load the controller's module
  beforeEach(function(){
      module('authServices');
      module('signControllers');
  });

  var SigninCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    SigninCtrl = $controller('SigninCtrl', {
      $scope: scope
    });

    // mock angular form
    scope.optionsForm = {model:{}};
    scope.optionsForm.model.$setValidity = function() {};

    // mock user
    scope.user = { email: '', password: '', username: '' };
  }));

  it('should set scope.errors[field] on mongoose errors', function () {
    $httpBackend.expectPOST('/auth/session').respond(400, {errors:{'model': {type:'Test Error'}}});

    scope.login(scope.optionsForm);
    $httpBackend.flush();
    expect(scope.errors.model).toBe('Test Error')
  });
});

'use strict';

describe('Controller: SignupCtrl', function () {

  // load the controller's module
  beforeEach(function(){
      module('authServices');
      module('signControllers');
  });

  var SignupCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    scope = $rootScope.$new();
    SignupCtrl = $controller('SignupCtrl', {
      $scope: scope
    });

    // mock angular form
    scope.optionsForm = {model:{}};
    scope.optionsForm.model.$setValidity = function() {};

    // mock user
    scope.user = { email: '', password: '', username: '' };
  }));

  it('should set scope.errors[field] on mongoose errors', function () {
    $httpBackend.expectPOST('/auth/users').respond(400, {errors:{'model': {type:'Test Error'}}});

    scope.register(scope.optionsForm);
    $httpBackend.flush();
    expect(scope.errors.model).toBe('Test Error')
  });
});
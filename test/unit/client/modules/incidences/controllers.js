'use strict';

describe('Controller: IncidencesCtrl', function () {

  // load the controller's module
  beforeEach(module('incidencesControllers'));

  var IncidencesCtrl,
    scope,
    $httpBackend,
    incidence, incidences,
    routeParams,
    $controller;

  beforeEach(inject(function (_$httpBackend_, _$controller_, $rootScope) {
    $httpBackend = _$httpBackend_;
    $controller = _$controller_;
    scope = $rootScope.$new();

    // mock incidence
    incidence = {name:'test', id: 1};
    // mock incidences
    incidences = [{name:'eeny', id: 2},{name:'meany', id: 3}];
    routeParams = {};
  }));

  it('should get a incidence from route params id and bind to scope', function () {
    routeParams.incidenceId = incidence.id;
    IncidencesCtrl = $controller('IncidencesCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });

    $httpBackend.expectGET('api/incidences/' + incidence.id).respond(incidence);
    scope.findOne();
    $httpBackend.flush();
    expect(scope.incidence.name).toBe(incidence.name)
  });

  it('should get an array of incidences from route params id and bind to scope', function () {
    IncidencesCtrl = $controller('IncidencesCtrl', {
      $scope: scope,
      $routeParams: routeParams
    });

    $httpBackend.expectGET('api/incidences').respond(incidences);
    scope.find();
    $httpBackend.flush();
    expect(scope.incidences[0].name).toBe(incidences[0].name)
    expect(scope.incidences[1].name).toBe(incidences[1].name)
  });
});
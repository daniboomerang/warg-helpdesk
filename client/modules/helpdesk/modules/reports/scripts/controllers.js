'use strict';

var reportsControllers = angular.module('reportsControllers', [])

reportsControllers.controller('IncidencesReportCtrl', function ($scope, $state, reportsService, totalsChartService, severityPriorityChartService, effortsChartService, assignationsChartService, schoolResourceService) {
 
    init();

    $scope.schoolReport = function (school){
      $state.go('helpdesk.reports.incidences.school', { schoolCode: school.code });
    }

    $scope.refreshSchools = function(){
      schoolResourceService.findSchools().then(function (schoolsList){      
        if (schoolsList.length > 0){
          $scope.schoolsList = schoolsList;
          $scope.school.selected = $scope.schoolsList[0];
          $scope.schoolsListReady = true;
        }
        else{
          if ($rootScope.currentUser.role = "admin"){
            openModalWarning();
          }
          else{
            $scope.schoolsListReady = true;
            $scope.schoolsListEmpty = true;   
          }
        }
      });
    };

    function init(){

      reportsService.generateIncidencesReport().then (function (report){
          
          // TOTALS
          $scope.totalsReport = report[0];
          $scope.totalsChart = totalsChartService.generate(report[0].list);
          console.log($scope.totalsChart);


          // SEVERITY- PRIORITY
          $scope.sevPriReport = report[1];
          $scope.severityChart = severityPriorityChartService.generateSeverity(report[1].list);
          $scope.priorityChart = severityPriorityChartService.generatePriority(report[1].list);
          console.log($scope.severityChart);
          console.log($scope.priorityChart);

          // EFFORT
          $scope.effortsReport = report[2];
          $scope.effortsChart =  effortsChartService.generate(report[2].list);
          console.log($scope.effortsChart);

          // ASSIGNATIONS
          $scope.assignationsReport = report[3];
          $scope.assignationsChart =  assignationsChartService.generate(report[3].list);
          console.log($scope.assignationsChart);

          //FUSION ASSIGNATIONS & EFFORT
          $scope.fusionAssignationsAndEffortsList = reportsService.fusionAssignAndEffort($scope.assignationsReport.list, $scope.effortsReport.list);

      });
     // Schools
      $scope.school = {};
      $scope.allowUpdate = false;
      $scope.schoolsListReady = false;

      var schoolsList = schoolResourceService.getSchools();
      if (schoolsList == null){
        $scope.schoolsListReady = false;
        $scope.schoolsListEmpty = false
      }
      else if (schoolsList.length == 0){
        // We need to check a School has been created recently.
        // So we ensure that, calling again to the server.
        schoolResourceService.findSchools().then(function (schoolsList){      
          if (schoolsList.length > 0){
            $scope.schoolsList = schoolsList;
            $scope.school.selected = $scope.schoolsList[0];
            $scope.schoolsListReady = true;
          }
          else{
            if ($rootScope.currentUser.role = "admin"){
              openModalWarning();
            }
            else{
              $scope.schoolsListReady = true;
              $scope.schoolsListEmpty = true;   
            }
          }
        });
      }
      else{
        $scope.schoolsList = schoolsList;
        $scope.school.selected = $scope.schoolsList[0];
        $scope.schoolsListReady = true;
        $scope.schoolsListEmpty = false;
      }
    } 
});

reportsControllers.controller('ISRCtrl', function ($scope, $state, reportsService, totalsChartService, severityPriorityChartService, effortsChartService, assignationsChartService) {

  $scope.goToGeneralDashboard = function (){
    $state.go('helpdesk.reports.incidences.general');
  }

  init();

  function init() {
    if ($state.params.schoolCode == ''){
      $state.go('helpdesk.reports.incidences.general');
    }
    else {

      reportsService.generateIncidencesSchoolReport($state.params.schoolCode).then (function (report) {

        $scope.schoolCode = $state.params.schoolCode;

        // TOTALS SCHOOL
        $scope.totalsReport = report[0];
        $scope.totalsChart = totalsChartService.generate(report[0].list);

        // SCHOOL SEVERITY- PRIORITY
        $scope.sevPriReport = report[1];
        $scope.severityChart = severityPriorityChartService.generateSeverity(report[1].list);
        $scope.priorityChart = severityPriorityChartService.generatePriority(report[1].list);

        // SCHOOL EFFORT
        $scope.effortsReport = report[2];
        $scope.effortsChart =  effortsChartService.generate(report[2].list);

        // SCHOOL ASSIGNATIONS
        $scope.assignationsReport = report[3];
        $scope.assignationsChart =  assignationsChartService.generate(report[3].list);

        // SCHOOL FUSION ASSIGNATIONS & EFFORT
        $scope.fusionAssignationsAndEffortsList = reportsService.fusionAssignAndEffort($scope.assignationsReport.list, $scope.effortsReport.list);
      });
    }
  }  

});


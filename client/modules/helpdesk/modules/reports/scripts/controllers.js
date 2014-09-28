'use strict';

var reportsControllers = angular.module('reportsControllers', [])

reportsControllers.controller('IncidencesReportCtrl', function ($scope,
                                                                reportsService,
                                                                totalsChartService,
                                                                severityPriorityChartService,
                                                                effortsChartService,
                                                                assignationsChartService
                                                               )
{
 
    init();

    function fusion (listOfAssignations, listOfEffort) {
        for (var i = 0; i <= listOfAssignations.length - 1; i++){
            listOfAssignations[i].workedOn = listOfEffort[i].workedOn;
            listOfAssignations[i].totalTimeReportedOn = listOfEffort[i].totalTimeReportedOn;
            listOfAssignations[i].solved = listOfEffort[i].solved;
            listOfAssignations[i].averageResolutionTime = listOfEffort[i].averageResolutionTime;
        } 
        return listOfAssignations;
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
            $scope.fusionAssignationsAndEffortsList = fusion($scope.assignationsReport.list, $scope.effortsReport.list);

        });
    } 
});

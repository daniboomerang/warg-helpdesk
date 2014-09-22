'use strict';

var reportsControllers = angular.module('reportsControllers', [])

reportsControllers.controller('IncidencesReportCtrl', function ($scope, reportService){
 
  init();

  function init(){

    $scope.totalInstitutions = 0;
    $scope.totalAccounts = 0;
    $scope.totalTecnicians = 0;
    $scope.totalUsers = 0;
    $scope.totalIncidences = 0;
    $scope.totalOpen = 0;
    $scope.totalOnGoing = 0;
    $scope.totalClosed = 0;
    $scope.totalSevSerious = 0;
    $scope.totalSevHigh = 0;
    $scope.totalSevMedium = 0;
    $scope.totalSevLow = 0;
    $scope.totalPriSerious = 0;
    $scope.totalPriHigh = 0;
    $scope.totalPriMedium = 0;
    $scope.totalPriLow = 0;
    $scope.totalEffort = 0;
    $scope.totalEffortPerTechnician = 0;

    reportService.generateIncidencesReport().then (function (report){
        // TOTAL
        $scope.totalsReport = report[0].totalsListReport;
        generateTotalsReportGoogleChart($scope.totalsReport);
        // SEVERITY- PRIORITY
        $scope.severityPriorityReport = report[1].severityPriorityListReport;
        generateSeverityPriorityReportGoogleChart($scope.severityPriorityReport);
        // ASSIGNATION
        $scope.effortsReport = report[2].effortsListReport;
        generateAssignationsReportGoogleChart($scope.effortsReport);
        generateEffortsReportGoogleChart($scope.effortsReport);
    });
  }  

  function generateAssignationsReportGoogleChart (effortsReport){

    function generateDataRows(effortsReport){
      var rows =[];

      for (var i = 0; i<= effortsReport.length -1; i++){
        
        for (var j = 0; (effortsReport[i].schoolTechnicians.length > 0) && (j <= effortsReport[i].schoolTechnicians.length -1); j++){
          rows.push({
            "c": [
              {
                "v": effortsReport[i].schoolTechnicians[j].username + ' - ' + effortsReport[i].institutionCode
              },
              {
                "v": effortsReport[i].numberAssignedIncidences
              }
            ]
          })
        }  
      }
      return rows;
    }

    $scope.chartObjectAssignations = {
      "type": "ColumnChart",
      "cssStyle": "width: 100%; min-height: 800px;",
      "displayed": true,
      "data": {
        "cols": [
          {
            "id": "school",
            "label": "School",
            "type": "string",
            "p": {}
          },
          {
            "id": "Assigned",
            "label": "Assigned Incidences",
            "type": "number",
            "p": {}
          }
        ],
        "rows": generateDataRows(effortsReport)
      },
      "options": {
        "title": "Assignations per institution",
        "isStacked": "true",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": {
          "title": "Assignations",
          "gridlines": {
            "count": 10
          }
        },
        "hAxis": {
          "title": "Institutions"
        },
        "tooltip": {
          "isHtml": true
        }
      },
      "formatters": {}
    }

  };


  function generateEffortsReportGoogleChart (effortsReport){

    function generateDataRows(effortsReport){
      var rows =[];

      for (var i = 0; i<= effortsReport.length -1; i++){
        
        $scope.totalEffort = $scope.totalEffort + effortsReport[i].totalEffort;
        $scope.totalEffortPerTechnician = $scope.totalEffortPerTechnician + effortsReport[i].totalEffortPerTechnician;

        rows.push({
          "c": [
            {
              "v": effortsReport[i].institution
            },
            {
              "v": (effortsReport[i].totalEffort / 60).toFixed(2) 
            }
          ]
        })
      }
      return rows;
    }

    $scope.chartObjectEffort = {
      "type": "ColumnChart",
      "cssStyle": "width: 100%; min-height: 800px;",
      "displayed": true,
      "data": {
        "cols": [
          {
            "id": "technician",
            "label": "technician",
            "type": "string",
            "p": {}
          },
          {
            "id": "Resolution time",
            "label": "Average resolution time",
            "type": "number",
            "p": {}
          }
        ],
        "rows": generateDataRows(effortsReport)
      },
      "options": {
        "title": "Resolution time",
        "isStacked": "true",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": {
          "title": "Total hours",
          "gridlines": {
            "count": 10
          }
        },
        "hAxis": {
          "title": "Institutions"
        },
        "tooltip": {
          "isHtml": true
        }
      },
      "formatters": {}
    }

  };


  function generateSeverityPriorityReportGoogleChart (severityPriorityReport){

      function generateDataRows(severityPriorityReport){
        var rows =[];

        for (var i = 0; i<= severityPriorityReport.length -1; i++){
          $scope.totalSevSerious = $scope.totalSevSerious + severityPriorityReport[i].numberSevSerious;
          $scope.totalSevHigh = $scope.totalSevHigh + severityPriorityReport[i].numberSevHigh;
          $scope.totalSevMedium= $scope.totalSevMedium + severityPriorityReport[i].numberSevMedium;
          $scope.totalSevLow = $scope.totalSevLow + severityPriorityReport[i].numberSevLow;
          $scope.totalPriSerious = $scope.totalPriSerious + severityPriorityReport[i].numberPriSerious;
          $scope.totalPriHigh = $scope.totalPriHigh + severityPriorityReport[i].numberPriHigh;
          $scope.totalPriMedium = $scope.totalPriMedium + severityPriorityReport[i].numberPriMedium;
          $scope.totalPriLow = $scope.totalPriLow + severityPriorityReport[i].numberPriLow;
          rows.push({
            "c": [
              {
                "v": severityPriorityReport[i].institution
              },
              {
                "v": severityPriorityReport[i].numberSevSerious              
              },
              {
                "v": severityPriorityReport[i].numberSevHigh,
              },
              {
                "v": severityPriorityReport[i].numberSevMedium,
              },
              {
                "v": severityPriorityReport[i].numberSevLow,
              },
              {
                "v": severityPriorityReport[i].numberPriSerious,
              },
              {
                "v": severityPriorityReport[i].numberPriHigh,
              },
              {
                "v": severityPriorityReport[i].numberPriMedium,
              },
              {
                "v": severityPriorityReport[i].numberPriLow,
              }
            ]
          })
        }
        return rows;
      }

      $scope.chartObjectSevPrio = {
        "type": "ColumnChart",
        "cssStyle": "width: 100%; min-height: 800px;",
        "displayed": true,
        "data": {
          "cols": [
            {
              "id": "school",
              "label": "School",
              "type": "string",
              "p": {}
            },
            {
              "id": "SevSerious",
              "label": "Incidences Sev-Serious",
              "type": "number",
              "p": {}
            },
            {
              "id": "SevHigh",
              "label": "Incidences Sev-High",
              "type": "number",
              "p": {}
            },
            {
              "id": "SevMedium",
              "label": "Incidences Sev-Medium",
              "type": "number",
              "p": {}
            },
            {
              "id": "SevLow",
              "label": "Incidences Sev-Low",
              "type": "number",
              "p": {}
            },
            {
              "id": "PriSerious",
              "label": "Incidences Pri-Serious",
              "type": "number",
              "p": {}
            },
            {
              "id": "PriHigh",
              "label": "Incidences Pri-High",
              "type": "number",
              "p": {}
            },
            {
              "id": "PriMedium",
              "label": "Incidences Pri-Medium",
              "type": "number",
              "p": {}
            },
            {
              "id": "PriLow",
              "label": "Incidences Pri-Low",
              "type": "number",
              "p": {}
            }
          ],
          "rows": generateDataRows(severityPriorityReport)
        },
        "options": {
          "title": "Severity and priority per institution",
          "isStacked": "true",
          "fill": 20,
          "displayExactValues": true,
          "vAxis": {
            "title": "Total Incidences",
            "gridlines": {
              "count": 10
            }
          },
          "hAxis": {
            "title": "Institutions"
          },
          "tooltip": {
            "isHtml": true
          }
        },
        "formatters": {}
      }

    };

     function generateTotalsReportGoogleChart (totalsReport){

      function generateDataRows(totalsReport){
        var rows =[];

        for (var i = 0; i<= totalsReport.length -1; i++){
          $scope.totalInstitutions++;
          $scope.totalAccounts = $scope.totalAccounts + totalsReport[i].totalAccounts;
          $scope.totalTecnicians = $scope.totalTecnicians + totalsReport[i].techniciansAccounts;
          $scope.totalUsers = $scope.totalUsers + totalsReport[i].usersAccounts;
          $scope.totalIncidences = $scope.totalIncidences + totalsReport[i].numberIncidences;
          $scope.totalOpen = $scope.totalOpen + totalsReport[i].numberOpenIncidences;
          $scope.totalOnGoing = $scope.totalOnGoing + totalsReport[i].numberOnGoingIncidences;
          $scope.totalClosed = $scope.totalClosed + totalsReport[i].numberClosedIncidences;

          rows.push({
            "c": [
              {
                "v": totalsReport[i].institution
              },
              {
                "v": totalsReport[i].numberOpenIncidences,
                "f": totalsReport[i].numberOpenIncidences + " incidences"
              },
              {
                "v": totalsReport[i].numberOnGoingIncidences,
                "f": totalsReport[i].numberOnGoingIncidences + " incidences"
              },
              {
                "v": totalsReport[i].numberClosedIncidences,
                "f": totalsReport[i].numberClosedIncidences + " incidences"
              }
            ]
          })
        }
        return rows;
      }

      $scope.chartObjectTotals = {
        "type": "PieChart",
        "cssStyle": "width: 100%; min-height: 600px;",
        "displayed": true,
        "data": {
          "cols": [
            {
              "id": "school",
              "label": "School",
              "type": "string",
              "p": {}
            },
            {
              "id": "Open",
              "label": "Open Incidences",
              "type": "number",
              "p": {}
            },
            {
              "id": "On Going",
              "label": "Assigned Incidences",
              "type": "number",
              "p": {}
            },
            {
              "id": "Closed",
              "label": "Archived Incidences",
              "type": "number",
              "p": {}
            }
          ],
          "rows": generateDataRows(totalsReport)
        },
        "options": {
          "title": "Incidences per Institution",
          "isStacked": "true",
          "fill": 20,
          "displayExactValues": true,
          "vAxis": {
            "title": "Total Incidences",
            "gridlines": {
              "count": 10
            }
          },
          "hAxis": {
            "title": "Institutions"
          },
          "tooltip": {
            "isHtml": true
          }
        },
        "formatters": {}
      }

    };
});

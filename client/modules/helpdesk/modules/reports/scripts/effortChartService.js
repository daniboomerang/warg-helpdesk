chartsGeneratorServices.factory('effortsChartService', function (){

  return {
    generate : function (effortsReport) {return generateGoogleChart(effortsReport);}  
  }

  function generateGoogleChart (effortsReport){
    
    function generateDataRows (effortsReport){
      var rows =[];

      for (var i = 0; i<= effortsReport.length -1; i++){
        rows.push({
          "c": [
            {
              "v": effortsReport[i].technician + ' (' + effortsReport[i].institution + ')'
            },
            {
              "v": (effortsReport[i].totalEffort / 60).toFixed(2) 
            }
          ]
        })
      }
      return rows;
    }

    return chartObjectEffort = {
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
        "title": "Average resolution time",
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
  }  
});

/*

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

  };*/
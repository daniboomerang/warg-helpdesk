chartsGeneratorServices.factory('severityPriorityChartService', function (){

  return {
    generateSeverity: function (severityPriorityReport) {return generateSevGoogleChart(severityPriorityReport);},
    generatePriority: function (severityPriorityReport) {return generatePriGoogleChart(severityPriorityReport);}
  };

  function generateSevGoogleChart (severityPriorityReport){
    function generateDataRows (severityPriorityReport){
      var rows =[];
      for (var i = 0; i<= severityPriorityReport.length -1; i++){
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
            }
          ]
        })
      }
      return rows;
    }

    return {
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
            "label": "Serious",
            "type": "number",
            "p": {}
          },
          {
            "id": "SevHigh",
            "label": "High",
            "type": "number",
            "p": {}
          },
          {
            "id": "SevMedium",
            "label": "Medium",
            "type": "number",
            "p": {}
          },
          {
            "id": "SevLow",
            "label": "Low",
            "type": "number",
            "p": {}
          }
        ],
        "rows": generateDataRows(severityPriorityReport)
      },
      "options": {
        "title": "Severity per institution",
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

 function generatePriGoogleChart (severityPriorityReport){
    function generateDataRows (severityPriorityReport){
      var rows =[];
      for (var i = 0; i<= severityPriorityReport.length -1; i++){
        rows.push({
          "c": [
            {
              "v": severityPriorityReport[i].institution
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

    return  {
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
            "id": "PriSerious",
            "label": "Serious",
            "type": "number",
            "p": {}
          },
          {
            "id": "PriHigh",
            "label": "High",
            "type": "number",
            "p": {}
          },
          {
            "id": "PriMedium",
            "label": "Medium",
            "type": "number",
            "p": {}
          },
          {
            "id": "PriLow",
            "label": "Low",
            "type": "number",
            "p": {}
          }
        ],
        "rows": generateDataRows(severityPriorityReport)
      },
      "options": {
        "title": "Priority per institution",
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
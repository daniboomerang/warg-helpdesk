chartsGeneratorServices.factory('assignationsChartService', function (){

  return {
    generate : function (assignationsReport) {return generateGoogleChart(assignationsReport);}  
  }

  function generateGoogleChart (assignationsReport){
    
    function generateDataRows (assignationsReport){
      var rows =[];

      for (var i = 0; i<= assignationsReport.length -1; i++){
        rows.push({
          "c": [
            {
              "v": assignationsReport[i].technician + ' (' + assignationsReport[i].institution + ')'
            },
            {
              "v": assignationsReport[i].numberAssignedIncidences
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
            "id": "Assigned",
            "label": "Assigned Incidences",
            "type": "number",
            "p": {}
          }
        ],
        "rows": generateDataRows(assignationsReport)
      },
      "options": {
        "title": "Assignations per technician",
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
  }  
});
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
              "v": effortsReport[i].technician + ' (' + effortsReport[i].institutionCode + ')'
            },
            {
              "v": (effortsReport[i].averageResolutionTime / 60).toFixed(2) 
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
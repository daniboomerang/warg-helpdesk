chartsGeneratorServices.factory('totalsChartService', function (){

  return {
    generate: function (totalsReport) {return generateGoogleChart(totalsReport);}
  }

  function generateGoogleChart (totalsReport){

    function generateDataRows (totalsReport){
      var rows =[];

      for (var i = 0; i<= totalsReport.length -1; i++){
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

    return {
      "type": "BarChart",
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
    };
  };
});
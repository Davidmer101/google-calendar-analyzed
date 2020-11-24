google.charts.load('current', {packages: ['corechart']});

google.charts.setOnLoadCallback(
    function() { // Anonymous function that calls drawChart1 and drawChart2
         drawChart1();
         drawChart2();
      });
      function drawChart(data) {
        // alert("in Chart: data is: " + JSON.stringify(data) + ' calendarList ' + calendarList)
        let keys = Object.keys(data)
        let num1 = data [keys[1]];
        let num2 = data [keys[2]];
        let num3 = data [keys[3]];
        let num4 = data [keys[4]];
        let num5 = data [keys[5]];
        // console.log("charts:drawChart: num1 is: " + num1 + " of type " + typeof num1)
        // Create the data table.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Calendar Name');
        data.addColumn('number', 'Hours Spent');

        data.addRows([
          [calendarList[0], num1],
          [calendarList[1], num2],
          [calendarList[2], num3],
          [calendarList[3], num4],
          [calendarList[4], num5]
        ]);
  
        // Set chart options
        var options = {'title':'How I Spent my Hours',
                       'width':400,
                       'height':300};
  
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('first-column'));
        chart.draw(data, options);

        data.sort({column: 1, desc: true});

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
                       { calc: "stringify",
                         sourceColumn: 1,
                         type: "string",
                         role: "annotation" }]);

      var barchart_options = {
        title: "Hours Spent doing: ",
        width: 600,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
      };
        
      
        var barchart = new google.visualization.BarChart(document.getElementById('third-column'));
        barchart.draw(view, barchart_options);
        let totalHoursLogged = num1 + num2 + num3 + num4 + num5
        document.getElementById('first-bottom-column').innerHTML =`total hours logged: ${totalHoursLogged.toFixed(2)}`
        // add productivity percentage
        if(productiveList.length) {
          let totalProductive = 0;
          if(productiveList.includes(calendarList[0].toLowerCase())) {
            totalProductive += num1;
          } 
          if(productiveList.includes(calendarList[1].toLowerCase())) {
            totalProductive += num2;
          } 
          if(productiveList.includes(calendarList[2].toLowerCase())) {
            totalProductive += num3;
          } 
          if(productiveList.includes(calendarList[3].toLowerCase())) {
            totalProductive += num4;
          }
          if(productiveList.includes(calendarList[4].toLowerCase())) {
            totalProductive += num4;
          }  
          totalProductive = (totalProductive/totalHoursLogged)*100
          document.getElementById('productivity-percentage').style.display = 'block'
          document.getElementById('productivity-percentage').innerHTML = totalProductive.toFixed(1) + '%';
        } 
        if(neutralList.length) {
          let totalNeutral = 0;
          if(neutralList.includes(calendarList[0].toLowerCase())) {
            totalNeutral += num1;
          } 
          if(neutralList.includes(calendarList[1].toLowerCase())) {
            totalNeutral += num2;
          } 
          if(neutralList.includes(calendarList[2].toLowerCase())) {
            totalNeutral += num3;
          } 
          if(neutralList.includes(calendarList[3].toLowerCase())) {
            totalNeutral += num4;
          }
          if(neutralList.includes(calendarList[4].toLowerCase())) {
            totalNeutral += num4;
          }  
          totalNeutral = (totalNeutral/totalHoursLogged)*100
          if(totalNeutral > 0) {
            document.getElementById('calc-neutrality').style.display = 'block'
            document.getElementById('neutrality-percentage').innerHTML = totalNeutral.toFixed(1) + '%';
          } else {
            document.getElementById('calc-neutrality').style.display = 'none'

          }
          
        }
        if (destructiveList.length) {
          let totalDestructive = 0;
          if(destructiveList.includes(calendarList[0].toLowerCase())) {
            totalDestructive += num1;
          } 
          if(destructiveList.includes(calendarList[1].toLowerCase())) {
            totalDestructive += num2;
          } 
          if(destructiveList.includes(calendarList[2].toLowerCase())) {
            totalDestructive += num3;
          } 
          if(destructiveList.includes(calendarList[3].toLowerCase())) {
            totalDestructive += num4;
          }
          if(destructiveList.includes(calendarList[4].toLowerCase())) {
            totalDestructive += num4;
          }  
          totalDestructive = (totalDestructive/totalHoursLogged)*100
          if(totalDestructive > 0) {
            // document.getElementById('calc-neutrality').style.display = 'block';
            document.getElementById('calc-destruction').style.display = 'block';
            document.getElementById('destruction-percentage').innerHTML = totalDestructive.toFixed(1) + '%';
          } else {
            document.getElementById('calc-destruction').style.display = 'none';
          }
        }
      
      }

      function drawChart1() {
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Hours per Day'],
          ['productive',     11],
          ['neutral',      2],
          ['destructing',  2]        
        ]);

        var options = {
          title: 'My Daily Activities',
          pieHole: 0.4,
          width:300,
          height: 200,
          legend: 'none'

        };

        // var chart = new google.visualization.PieChart(document.getElementById('second-column'));
        chart.draw(data, options);
    }

      function drawChart2(data) {

      }

     
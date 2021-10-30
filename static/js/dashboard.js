var user = ""

//when user pick the name from user list, send a POST request to get data
$('#user_list').on("change", function () {
  if ($("select option:selected").text() == "Choose a User") {
    return
  }
  user = $("select option:selected").text();
  $('#dashboard').show();

  //request data
  $.ajax({
    type: 'GET',
    contentType: "application/json; charset=utf-8",
    url: "/query_datas/"+ user,
   // data: JSON.stringify({ "user_name": user }),
    success: function (response) {
      //update data 8 elements and
      let basic_info_dic = basic_info_analysis(response)

      let time = basic_info_dic['accumulated_time']  + ' mins'
      let average_correctness = basic_info_dic['avg_correctness'] + '%'
      let best_correctness = basic_info_dic['best_correctness'] + '%'
      $('#grid1').text(basic_info_dic['attempt'])
      $('#grid2').text(basic_info_dic['last_attempt'])
      $('#grid3').text(average_correctness)
      $('#grid4').text(best_correctness)
      $('#grid5').text(time)
      $('#grid6').text(basic_info_dic['avg_typing_speed'])
      $('#grid7').text(basic_info_dic['best_speed'])
      draw_performance_line_Chart(daily_performance_analysis(response));
      draw_mistakes_pie_chart(mistakes_analysis(response));
    },
    error: function (response) {
      console.log("server return Error,url:/query_basic_data");
    }
  })
})

//analysis daily typing speed, avg typing speed, correctness, avg correctness
function daily_performance_analysis(data_dic){
    session_array = data_dic['sessions']
    attempt_counter = 0
    accumulated_correctness = 0
    accumulated_typing_speed = 0
    chart_data_list = []
    for(let i =0; i < session_array.length;i++){
        attempt_counter += 1
        accumulated_correctness += session_array[i]['score']
        accumulated_typing_speed += session_array[i]['typing_speed']
        chart_data_list.push({
        'date' : session_array[i]['end_time'],
        'correctness': session_array[i]['score'],
        'typing_speed':session_array[i]['typing_speed'],
        'avg_correctness': accumulated_correctness / attempt_counter,
        'avg_typing_speed' : accumulated_typing_speed / attempt_counter,

        })
    }
    return chart_data_list

}

function basic_info_analysis(data_dic){
    attempt = data_dic['sessions'].length
    last_attempt = data_dic['user']['last_attempt']
    created_time = data_dic['user']['created_time']

    accumulated_time = 0
    typing_speed = []
    scores= []
    session_array = data_dic['sessions']
    for(let i =0; i < attempt;i++){
        accumulated_time += session_array[i]['time_spent']
        typing_speed.push(session_array[i]['typing_speed'])
        scores.push(session_array[i]['score'])
    }
    const average = arr => arr.reduce((acc,v) => acc + v) / arr.length;
    avg_typing_speed= average(typing_speed)
    avg_score=average(scores)

    return {
        'attempt':attempt,
        'last_attempt':last_attempt,
        'created_time':created_time,
        'avg_typing_speed' : avg_typing_speed,
        'avg_correctness' : Math.round(avg_score  * 100),
        'best_correctness': Math.round(getMaxOfArray(scores) * 100),
        'best_speed': getMaxOfArray(typing_speed),
        'accumulated_time' : Math.round(accumulated_time / 60),
     }
}

function mistakes_analysis(data_dic){
    let key_dic={}
    data_dic['sessions'].forEach(travel_mistakes)

    function travel_mistakes(mistake_list){
        mistake_list['mistakes'].forEach((mistake) =>  {
            key_dic[mistake[2]] = key_dic[mistake[2]]+1 || 1
        })
    }
    return sort_dic_value(key_dic)
}

function sort_dic_value(dic){
    container = Object.entries(dic)

    return container.sort((a,b)=> b[1] - a[1])
}

// draw correctness and typing speed chart 1th and 4th
function draw_performance_line_Chart(data_list) {
      {
        var data = new google.visualization.DataTable();
        data.addColumn('date', 'Time of Day');
        data.addColumn('number', 'Avg.');
        data.addColumn('number', 'Correctness');

        var i;
        for (i = 0; i < data_list.length; i++) {
          data.addRow([new Date(data_list[i]['date']), data_list[i]['avg_correctness'], data_list[i]['correctness']]);
        }
        var options = {
          width: 500,
          height: 350,
          legend: { position: 'bottom' },
          enableInteractivity: true,
          chartArea: {
            width: '90%'
          },
          hAxis: {
            gridlines: {
              count: -1,
              units: {
                days: { format: ['MMM dd'] },
                hours: { format: ['HH:mm', 'ha'] },
              }}},
          vAxis: {
            gridlines: { color: 'none' },
            viewWindowMode: 'explicit',
            viewWindow: {
              max: 1,
              min: 0
            }}
        };
        var chart = new google.visualization.LineChart(document.getElementById('chart_div_1st'));
        chart.draw(data, options);

      }
      //draw typing_speed
      {
        var data = new google.visualization.DataTable();
        data.addColumn('datetime', 'Time of Day');
        data.addColumn('number', 'avg.');
        data.addColumn('number', 'Typing speed');

        var i;
        for (i = 0; i < data_list.length; i++) {
          data.addRow([new Date(data_list[i]['date']), data_list[i]['avg_typing_speed'], data_list[i]['typing_speed']]);
          console.log(data_list[i]['date'])
        }
        var options = {
          width: 500,
          height: 350,
          legend: { position: 'bottom' },
          enableInteractivity: true,
          chartArea: {
            width: '90%'
          },
          hAxis: {
            gridlines: {
              count: -1,
              units: {
                days: { format: ['MMM dd'] },
                hours: { format: ['HH:mm', 'ha'] },
              }}
          },
          vAxis: {
            gridlines: { color: 'none' },
            viewWindowMode: 'explicit',
          }
        };

        var chart = new google.visualization.LineChart(
        document.getElementById('chart_div_4th'));
        chart.draw(data, options);
      }
}

function getMaxOfArray(numArray) {

    return Math.max.apply(null, numArray);
}

// draw mistakes pie chart and bar chart.
function draw_mistakes_pie_chart(data_list) {
      {
        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Key');
        data.addColumn('number', 'Value');
        var i;
        for (i = 0; i < data_list.length; i++) {
          data.addRow(data_list[i]);
        }
        var options = {
          'width': 500,
          'height': 350,
          chartArea: {
            width: '90%'
          },
          legend: { position: 'none' }
        };

        var chart = new google.visualization.PieChart(document.getElementById('chart_div_SS'));
        chart.draw(data, options);

      }
      /////////////////draw bar chart
      {
        let color = ['#3366cc', '#dc3912', '#ff9900', '#109618', '#990099']  //a color dictionary to make the bar chart color matches the pie chart
        let data = new google.visualization.DataTable();
        data.addColumn('string', 'Key');
        data.addColumn('number', 'times');
        data.addColumn({ type: 'string', role: 'style' });

        var i;
        var length = data_list.length
        if (length > 5) {
          length = 5
        }

        for (i = 0; i < length; i++) {
          data.addRow([data_list[i][0], data_list[i][1], color[i]]);
        }
        let options = {
          'width': 500,
          'height': 350,
          legend: { position: 'none' },
          chartArea: {
            width: '85%'
          }};
        // Instantiate and draw the chart.
        var chart = new google.visualization.BarChart(document.getElementById('chart_div_3th'));
        chart.draw(data, options);
      }
}

$("#print-button").click(function () {
  window.print();
}
);

$("#first-chart-1").click(function () {
  var Pagelink = "about:blank";
  var pwa = window.open(Pagelink, "_new");
  pwa.document.open();
  pwa.document.write(ImagetoPrint($("#img-1").attr('src')));
  pwa.document.close();

});

$("#second-chart-1").click(function () {
  var Pagelink = "about:blank";
  var pwa = window.open(Pagelink, "_new");
  pwa.document.open();
  pwa.document.write(ImagetoPrint($("#img-2").attr('src')));
  pwa.document.close();

});

function ImagetoPrint(source) {
    return "<html><head><scri" + "pt>function step1(){\n" +
         "setTimeout('step2()', 10);}\n" +
         "function step2(){window.print();window.close()}\n" +
         "</scri" + "pt></head><body onload='step1()'>\n" +
         "<img src='" + source + "' /></body></html>";
}



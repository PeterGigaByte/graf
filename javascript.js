/*
    if (typeof (EventSource) !== "undefined") {
        var source = new EventSource("http://vmzakova.fei.stuba.sk/sse/sse.php");

        source.addEventListener("message", function (e) {
            var data = JSON.parse(e.data);
            x = e.data.split('"');
            alert(data.length);
            document.getElementById("output").innerHTML = "x: " + x[3] + " y1: " + x[7] + " y2: " + x[11];
        }, false);

    } else {
        document.getElementById("output").innerHTML = "Sorry, your browser does not support server-sent events...";
    }
*/
// GRAF FUNKCIE
window.onload = function () {

    var dataPoints1 = [];
    var dataPoints2 = [];

    var chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,
        title: {
            text: "sin(x) & cos(x)"
        },
        axisX: {
            title: "chart updates every 3 secs"
        },
        axisY:{
            prefix: "x"
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor:"pointer",
            verticalAlign: "top",
            fontSize: 22,
            fontColor: "dimGrey",
            itemclick : toggleDataSeries
        },
        data: [{
            type: "line",
            xValueType: "dateTime",
            yValueFormatString: "0.00000",
            xValueFormatString: "hh:mm:ss TT",
            showInLegend: true,
            name: "Cosinus(x)",
            dataPoints: dataPoints1
        },
            {
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "0.00000",
                showInLegend: true,
                name: "Sinus(x)" ,
                dataPoints: dataPoints2
            }]
    });

    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        }
        else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

    var updateInterval = 1000;
// initial value
    var yValue1 = 600;
    var yValue2 = 605;

    var time = new Date;
// starting at 9.30 am
    time.setHours(9);
    time.setMinutes(30);
    time.setSeconds(00);
    time.setMilliseconds(00);

    function updateChart(count) {
        var deltaY1, deltaY2;

        count = count || 1;

        for (var i = 0; i < count; i++) {
            time.setTime(time.getTime()+ updateInterval);

            // adding random value and rounding it to two digits.
            if (typeof (EventSource) !== "undefined") {
                var source = new EventSource("http://vmzakova.fei.stuba.sk/sse/sse.php");

                source.addEventListener("message", function (e) {
                    var data = JSON.parse(e.data);
                    var x = e.data.split('"');
                    deltaY1=x[3];
                    deltaY2=x[3];
                    yValue1 = x[7];
                    yValue2 = x[11];
                    document.getElementById("output").innerHTML = "x: " + x[3] + " y1: " + x[7] + " y2: " + x[11];
                }, false);

            } else {
                document.getElementById("output").innerHTML = "Sorry, your browser does not support server-sent events...";
            }

            // pushing the new values
            dataPoints1.push({
                x: time.getTime(),
                y: yValue1
            });
            dataPoints2.push({
                x: time.getTime(),
                y: yValue2
            });
        }

        // updating legend text with  updated with y Value
        chart.options.data[0].legendText = " Company A  $" + yValue1;
        chart.options.data[1].legendText = " Company B  $" + yValue2;
        chart.render();
    }
// generates first set of dataPoints
    updateChart(1);
    setInterval(function(){updateChart()}, updateInterval);

}
window.onload = function () {
    var checkboxRange=false;
    var checkboxNumber=false;

    document.getElementById("number").addEventListener("change",()=>{
        document.getElementById("range").value=document.getElementById("number").value;
    })
    document.getElementById("range").addEventListener("change",()=>{
        document.getElementById("number").value=document.getElementById("range").value;
    })
    document.getElementById("rangeC").addEventListener("click",()=>{
        checkboxRange=!checkboxRange;
        if(checkboxRange===true){
            document.getElementById("rangeD").style.display ="flex";
        }else{

            document.getElementById("rangeD").style.display ="none";
        }
    })
    document.getElementById("numberC").addEventListener("click",()=>{
        checkboxNumber=!checkboxNumber;
        if(checkboxNumber===true){
            document.getElementById("numD").style.display="flex";
        }else{
            document.getElementById("numD").style.display="none";
        }
    })
    var dataPoints1 = [];
    var dataPoints2 = [];
    var cosinusShow = true;
    var sinusShow = true;
    var stop = false;
    document.getElementById("button").addEventListener("click",()=>{
        stop = !stop;
    })
    var chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,

        title: {
            text: "sin(x) & cos(x)"
        },
        axisX: {

            title: "Update každú sekundu"
        },
        axisY:{
            prefix: ""
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
            type: "spline",
            xValueType: "dateTime",
            yValueFormatString: "0.00000",
            xValueFormatString: "hh:mm:ss TT",
            showInLegend: true,
            name: "Cosinus(x)",
            dataPoints: dataPoints1,
            visible: cosinusShow
        },
            {
                type: "spline",
                xValueType: "dateTime",
                yValueFormatString: "0.00000",
                showInLegend: true,
                name: "Sinus(x)" ,
                dataPoints: dataPoints2,
                visible:sinusShow
            }],
        options: {
            scale: {
                ticks: {
                    suggestedMin: 50,
                    suggestedMax: 100
                }
            }
        }
    });
    document.getElementById("cosinus").addEventListener("click",()=>{
        cosinusShow = !cosinusShow;
        chart.options.data[1].visible=cosinusShow;
        console.log("clicked on cosinus result= "+cosinusShow)
        chart.render();
    })
    document.getElementById("sinus").addEventListener("click",()=>{
        sinusShow = !sinusShow;
        chart.options.data[0].visible=sinusShow;
        console.log("clicked on sinus result= "+sinusShow)
        chart.render();
    })
    function toggleDataSeries(e) {
        e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible);
        chart.render();
    }
    var updateInterval = 1000;
    var yValue1 = 0;
    var yValue2 = 1;
    var time = new Date;
    function updateChart() {
            if(stop===true){
                chart.options.data.view
                return false;
            }
            time.setTime(time.getTime()+ updateInterval);
            if (typeof (EventSource) !== "undefined") {
                var source = new EventSource("http://vmzakova.fei.stuba.sk/sse/sse.php");
                source.addEventListener("message", function (e) {
                    var data = JSON.parse(e.data);
                    var x = e.data.split('"');
                    var k = document.getElementById("number").value;
                    yValue1 = parseFloat(x[7])*k;
                    yValue2 = parseFloat(x[11])*k;
                }, false);
            } else {
                document.getElementById("output").innerHTML = "Sorry, your browser does not support server-sent events...";
            }
            dataPoints1.push({
                x: time.getTime(),
                y: yValue1
            });
            dataPoints2.push({
                x: time.getTime(),
                y: yValue2}
                );
        // update
        chart.options.data[0].legendText = " Sinus(x) " + yValue1;
        chart.options.data[1].legendText = " Cosinus(x) " + yValue2;
        chart.render();
    }
    updateChart();
    setInterval(function(){updateChart()}, updateInterval);
}
class RangeComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="row">
                 <div class="component text">
                         <label class="container">Amplitúda(number)
                          <input type="checkbox" id="numberC"  name="numberC"  value="true">
                           <span class="checkmark"></span>
                        </label>
                    </div>
                <div id="numD" class="component text">
                    <label for="number">number:</label><input id="number" min="1" type="number" name="number" value="1">
                </div>
                <div class="component text">
                    <label class="container">Amolitúda(slide)
                        <input type="checkbox" id="rangeC" name="rangeC"  value="true">
                        <span class="checkmark"></span>
                    </label>
                </div>
                <div id="rangeD" class="component text">
                    <label for="range">slide:</label><input id="range" min="1" type="range" name="range" value="1">
                </div>
            </div>`;
    }
}
if (!customElements.get('range-component')) {
    customElements.define('range-component', RangeComponent);
}

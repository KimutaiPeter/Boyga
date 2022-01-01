window.onbeforeunload=LeavingPage;
function onPageLoad(){
    //console.log("The Page is ready")
}
function LeavingPage(){
    //console.log("Leaving Page")
}


//var socket=new WebSocket('ws:///192.168.168.90:8000/ws/TemperatureServer/');
socket=io();
socket.connect("http://127.0.0.1:5000");
socket.on("connect",function () {console.log("Connected")});

socket.on("message",function (msg) {console.log(msg); OnReceivivingData(msg)});

function OnReceivivingData(data) {
    var FlaskData=JSON.parse(e.data);
    //console.log(djangoData)
    //var disp=document.querySelector("#number");
    //disp.textContent=djangoData.value;
    UpdateGraph(FlaskData.CurrentSensorIDs,FlaskData.CurrentTempValues,FlaskData.DisplayData,FlaskData.Time);
}

/*socket.onmessage=function (e) {
    var FlaskData=JSON.parse(e.data);
    //console.log(djangoData)
    //var disp=document.querySelector("#number");
    //disp.textContent=djangoData.value;
    UpdateGraph(FlaskData.CurrentSensorIDs,FlaskData.CurrentTempValues,FlaskData.DisplayData,FlaskData.Time);

}*/


const ctx = document.getElementById('chart').getContext('2d');
const Template={
            label: 'Template',
            data: [0,0, 0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                //'rgba(54, 162, 235, 0.2)',
                //'rgba(255, 206, 86, 0.2)',
                //'rgba(75, 192, 192, 0.2)',
                //'rgba(153, 102, 255, 0.2)',
                //'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                //'rgba(255, 99, 132, 1)',
                //'rgba(54, 162, 235, 1)',
                //'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                //'rgba(153, 102, 255, 1)',
                //'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        };

let lastarray=[];


var chartData={
    type: 'line',
    data: {
        labels: ['now', 'now', 'now', 'now', 'now', 'now'],
        datasets: [{
            label: 'Max',
            data: [0, 0, 0, 0, 0, 0],
            fill:'+1',
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                //'rgba(54, 162, 235, 0.2)',
                //'rgba(255, 206, 86, 0.2)',
                //'rgba(75, 192, 192, 0.2)',
                //'rgba(153, 102, 255, 0.2)',
                //'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                //'rgba(255, 99, 132, 1)',
                //'rgba(54, 162, 235, 1)',
                //'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                //'rgba(153, 102, 255, 1)',
                //'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        },

            //The second dataset
            {
            label: 'Min',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],

            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }
        ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
}

const myChart = new Chart(ctx, chartData);





function Simulation(num1,num2,lists){
    var dataset1=chartData.data.datasets[0].data;
    var dataset2=chartData.data.datasets[1].data;

    dataset1.shift();
    dataset1.push(num1);
    dataset2.shift();
    dataset2.push(num2);

    chartData.data.datasets[0].data=dataset1;
    chartData.data.datasets[1].data=dataset2;
    myChart.update();



}


function goHome(){
    //socket=new WebSocket('ws:///localhost:8080/ws/TemperatureServer/');
}



function UpdateGraph(OnlineSensorIds,TemperetureData,DisplayData,Time){
    const date=new Date();
    var min=Math.min.apply(null,TemperetureData);
    var max=Math.max.apply(null,TemperetureData)

    var dataset1=chartData.data.datasets[0].data;
    var dataset2=chartData.data.datasets[1].data;
    var xaxis=chartData.data.labels



    dataset1.shift();
    dataset1.push(DisplayData.Max);
    dataset2.shift();
    dataset2.push(DisplayData.Min);
    xaxis.shift();
    xaxis.push(Time);

    chartData.data.datasets[0].data=dataset1;
    chartData.data.datasets[1].data=dataset2;
    myChart.update();


    //Updating the avarage ,max and min in the text
    Avarage=document.querySelector("#AvgDisplayValue");
    Avarage.textContent=DisplayData.Avg;
    MaxDisplay=document.querySelector("#MaxDisplayValue");
    MaxDisplay.textContent=DisplayData.Max;
    MinDisplay=document.querySelector("#MinDisplayValue");
    MinDisplay.textContent=DisplayData.Min;


    //Updating the table
    var table=document.querySelector("#tableDetails");

    //Checking for rows to add n update
    var CurrentSensors=[];
    var CurrentDisplayedData=document.querySelector("#tableDetails").rows;
    //Get the names currently
    for(a=0;a<CurrentDisplayedData.length;a++){
        CurrentSensors.push(CurrentDisplayedData[a].id);
    }

    //console.log(TemperetureData);
    //Adding newRows if they are not there
    for(a=0;a<OnlineSensorIds.length;a++){
        if(CurrentSensors.includes(OnlineSensorIds[a])){
            //Update the sensor that is available in the table
            var RowToUpdate=document.querySelector("#"+OnlineSensorIds[a]);
            RowToUpdate.cells[1].textContent=TemperetureData[a];
        }
        else {
            //Adding the sensors data
            var row = document.createElement("tr");
            row.id=OnlineSensorIds[a];
            row.style="height: 47px;";
            var Sensorcell = document.createElement("td");
            var TempValuecell = document.createElement("td");
            Sensorcell.textContent=OnlineSensorIds[a];
            Sensorcell.className="u-border-3 u-border-grey-75 u-table-cell";
            //console.log(TemperetureData[a]);
            TempValuecell.textContent=TemperetureData[a];
            TempValuecell.className="u-border-3 u-border-grey-75 u-table-cell";
            row.appendChild(Sensorcell);
            row.appendChild(TempValuecell)
            table.appendChild(row)
        }
    }

    //Removing the rows that are not in the list of online sensors
    //console.log(CurrentSensors);
    for (a=0;a<CurrentSensors.length;a++){
        //console.log(CurrentSensors[a]);
        if(OnlineSensorIds.includes(CurrentSensors[a])){
            //Do nothing coz its the sensor in question is part of the sensors that are online
        }
        else{
            //Removing the sensor in question
            str='#'+CurrentSensors[a];
            //console.log(str);
            var UnavailableSensor = document.querySelector(str);
            UnavailableSensor.remove();
        }
    }



    //Updateing the table




}




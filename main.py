from flask import Flask,render_template,send_file
from flask_socketio import SocketIO
from random import randint
import json


Time='Unset'
TempData=[0,0]
SensorData=["Unset","Unset"]
Time="unset"
CurrentTempValues=[1,2,3,4,5]
CurrentSensorIDs=['s1','s2','s3','s4','s5']



app=Flask(__name__)
app.config["SECRET_KEY"]="Something"
socket=SocketIO(app)

lists=["A","B","c"]
i=0

@app.route('/')
@app.route('/hello')
def downloads():
    return render_template("downloadpage.html")


@app.route('/download')
def downloadFile ():
    #For windows you need to use drive name [ex: F:/Example.pdf]
    path = "C:\\Users\\Peter\\Desktop\\PythonCode\\Flask\\TemperatureServer1\\SensorSimulation.py"
    return send_file(path, as_attachment=True)

@app.route('/datalog')
def HelloWorld():
    return render_template("Page-5.html")




@socket.on('message')
def handlemsg(msg):
    global Time,CurrentTempValues,CurrentSensorIDs
    Time=msg[1]
    CurrentTempValues=msg[3]
    CurrentSensorIDs=msg[2]


    if(msg[0]=="data"):
        socket.send(json.dumps({'value': randint(-20, 20), 'CurrentSensorIDs': CurrentSensorIDs, 'CurrentTempValues': CurrentTempValues,'Time': Time, "DisplayData": {'Max': int(max(CurrentTempValues)), 'Min': int(min(CurrentTempValues)),'Avg': round(sum(CurrentTempValues) / len(CurrentTempValues))}}))




@socket.on('data')
def HandleData(data):
    global Time, CurrentTempValues, CurrentSensorIDs
    Time = data[1]
    CurrentTempValues = data[3]
    CurrentSensorIDs = data[2]
    socket.send(json.dumps({'value': randint(-20, 20), 'CurrentSensorIDs': CurrentSensorIDs, 'CurrentTempValues': CurrentTempValues,'Time': Time, "DisplayData": {'Max': int(max(CurrentTempValues)), 'Min': int(min(CurrentTempValues)),'Avg': round(sum(CurrentTempValues) / len(CurrentTempValues))}}))




if __name__ == '__main__':
    socket.run(app,host='0.0.0.0', port=5000,debug=True)
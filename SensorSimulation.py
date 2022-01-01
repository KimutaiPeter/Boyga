import socketio
import time,random

sio=socketio.Client()


try:
    sio.connect("http://127.0.0.1:5000")
except:
    print('error connection to server')


@sio.event
def connected():
    print("Server connected, your id is :"+sio.sid)


@sio.event
def message(msg):
    print(msg)

@sio.event
def disconnect():
    print('Disconnected...')




for i in range(100):
    #sio.emit("message","S"+str(i))
    time.sleep(0.5)
    sio.emit("data",['data',random.randint(12,23),random.randint(12,23),random.randint(12,23)])


sio.disconnect()
# import eventlet
# import socketio
# import base64
# import io
# import cv2
# import pickle

# MAX_BUFFER_SIZE = 20 * 1000 * 1000
# sio = socketio.Server(max_http_buffer_size=MAX_BUFFER_SIZE)
# app = socketio.WSGIApp(sio, static_files={
#     '/': {'content_type': 'text/html', 'filename': 'index.html'}
# })

# @sio.event
# def connect(sid, environ):
#     print('connect ', sid)
#     my_message(sid, {"data": "message"})

# @sio.event
# def my_message(sid, data):
#     sio.emit('my_message', data)
#     print('message ', data)

# @sio.event
# def my_response(sid, data):
#     print('response', data)

# @sio.on('image')
# def image(sid, data):

#     frame = pickle.loads(data)
#     # print(frame)
#     cv2.imshow('frame', frame)
#     # cv2.waitKey(0)
#     # cv2.destroyAllWindows()
#     cv2.waitKey(1)

#     # sbuf = io.StringIO()
#     # sbuf.write(data_image)

#     # print(data_image)
#     # # # decode and convert into image
#     # b = io.BytesIO(base64.b64decode(data_image))
#     # pimg = Image.open(b)

#     # ## converting RGB to BGR, as opencv standards
#     # frame = cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)

#     # # Process the image frame
#     # frame = imutils.resize(frame, width=700)
#     # frame = cv2.flip(frame, 1)
#     # imgencode = cv2.imencode('.jpg', frame)[1]

#     # # base64 encode
#     # stringData = base64.b64encode(imgencode).decode('utf-8')
#     # b64_src = 'data:image/jpg;base64,'
#     # stringData = b64_src + stringData

#     # emit the frame back
#     # emit('response_back', stringData)

# @sio.event
# def disconnect(sid):
#     print('disconnect ', sid)

# if __name__ == '__main__':
#     eventlet.wsgi.server(eventlet.listen(('', 5001)), app)


# from IPython.display import clear_output
import socket
import sys
import cv2
# import matplotlib.pyplot as plt
import pickle
import numpy as np
import struct ## new
import zlib
import base64
from PIL import Image, ImageOps

HOST=''
PORT=8485

s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
print('Socket created')

s.bind((HOST,PORT))
print('Socket bind complete')
s.listen(10)
print('Socket now listening')

conn,addr=s.accept()

# data = b""
# payload_size = struct.calcsize(">L")
# print("payload_size: {}".format(payload_size))
while True:
    data += conn.recv(4096)
    frame = pickle.loads(data)
    frame = base64.b64decode(frame).decode('utf-8')
    cv2.imshow('frame', frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    cv2.waitKey(1)
    # while len(data) < payload_size:
    #     data += conn.recv(4096)
    #     if not data:
    #         cv2.destroyAllWindows()
    #         conn,addr=s.accept()
    #         continue
    # # receive image row data form client socket
    # packed_msg_size = data[:payload_size]
    # data = data[payload_size:]
    # msg_size = struct.unpack(">L", packed_msg_size)[0]
    # while len(data) < msg_size:
    #     data += conn.recv(4096)
    # frame_data = data[:msg_size]
    # data = data[msg_size:]
    # # unpack image using pickle 
    # frame=pickle.loads(frame_data, fix_imports=True, encoding="bytes")
    # frame = cv2.imdecode(frame, cv2.IMREAD_COLOR)

    # cv2.imshow('server',frame)
    # cv2.waitKey(1)

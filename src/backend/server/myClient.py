# import socketio
# import cv2
# import pickle
# from time import sleep

# sio = socketio.Client()
# cap=cv2.VideoCapture(0)

# @sio.event
# def connect():
#     print('connection established')
#     send_frames()

# @sio.event
# def my_message(data):
#     print('message received with ', data)


# @sio.event
# def send_frames():
#     img_counter = 0
#     encode_param=[int(cv2.IMWRITE_JPEG_QUALITY),90]
#     while True:
#         ret,frame=cap.read()
#         # result, image = cv2.imencode('.jpg', frame, encode_param)
#         data = pickle.dumps(frame)
#         if img_counter % 10 == 0:
#             sio.emit('image', data)
#         img_counter+=1

#         if cv2.waitKey(1) & 0xFF == ord('q'):
#             break

# @sio.event
# def disconnect():
#     print('disconnected from server')


# sio.connect('http://localhost:5001')
# sio.wait()

import cv2
import io
import socket
import struct
import time
import pickle
import numpy as np
import imutils


client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# client_socket.connect(('0.tcp.ngrok.io', 19194))
client_socket.connect(('172.18.134.19', 8485))

cam = cv2.VideoCapture(0)
img_counter = 0

#encode to jpeg format
#encode param image quality 0 to 100. default:95
#if you want to shrink data size, choose low image quality.
encode_param=[int(cv2.IMWRITE_JPEG_QUALITY),90]

while True:
    ret, frame = cam.read()
    # 影像縮放
    frame = imutils.resize(frame, width=320)
    # 鏡像
    frame = cv2.flip(frame,180)
    result, image = cv2.imencode('.jpg', frame, encode_param)
    data = pickle.dumps(image, 0)
    size = len(data)

    if img_counter%5==0:
        client_socket.sendall(struct.pack(">L", size) + data)
        cv2.imshow('client',frame)
        
    img_counter += 1

    # 若按下 q 鍵則離開迴圈
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
    

cam.release()
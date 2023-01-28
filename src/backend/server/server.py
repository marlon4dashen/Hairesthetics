import eventlet
eventlet.monkey_patch()
from sys import stdout
from hair_segmentation.hair_color.hair_artist import Hair_Artist
import logging
from flask import Flask, render_template, Response
from flask_socketio import SocketIO, emit
from .camera import Camera
import cv2
import numpy as np
from time import sleep
import base64
import io
import imageio.v2 as imageio
import logging
from utils.utils import *
import binascii
# import matplotlib.pyplot as plt

app = Flask(__name__)
logger = logging.getLogger()
app.logger.addHandler(logging.StreamHandler(stdout))
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True
socketio = SocketIO(app, cors_allowed_origins="*")
camera = None
hair_artist = None
vc = cv2.VideoCapture(0)

# if os.environ.get("FLASK_ENV") == "production":
#     origins = [
#         "http://actual-app-url.herokuapp.com",
#         "https://actual-app-url.herokuapp.com"
#     ]
# else:
#     origins = "*"


# @socketio.on('input image', namespace='/test')
# def test_message(input):
#     input = input.split(",")[1]
#     camera.enqueue_input(input)
    # image_data = input # Do your magical Image processing here!!
    # #image_data = image_data.decode("utf-8")

    # img = imageio.imread(io.BytesIO(base64.b64decode(image_data)))
    # cv2_img = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    # retval, buffer = cv2.imencode('.jpg', cv2_img)
    # b = base64.b64encode(buffer)
    # b = b.decode()
    # image_data = "data:image/jpeg;base64," + b

    # # print("OUTPUT " + image_data)
    # emit('out-image-event', {'image_data': image_data}, namespace='/test')
    # camera.enqueue_input(base64_to_pil_image(input))


@socketio.on('connect', namespace='/test')
def test_connect():
    print("client connected")
    global camera
    camera = init_camera()


def init_camera():
    global hair_artist
    hair_artist = Hair_Artist()
    return Camera(hair_artist)

@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')


def gen():
    """Video streaming generator function."""

    app.logger.info("starting to generate frames!")
    while True:
        read_return_code, frame = vc.read()
        output = hair_artist.apply_hair_color(frame, "darkred")
        output = cv2.cvtColor(output, cv2.COLOR_BGR2RGB)
        output_str = binascii.a2b_base64(cv2_image_to_base64(output))
        # frame = camera.get_frame() #pil_image_to_base64(camera.get_frame())
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + output_str + b'\r\n')


@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    while not hair_artist:
        sleep(0.05)
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    socketio.run(app, port=5001)

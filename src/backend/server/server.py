import eventlet
eventlet.monkey_patch()
from sys import stdout
from hair_segmentation.hair_color.hair_artist import Hair_Artist
import requests
import logging

import os
from flask import Flask, render_template, Response, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import cross_origin
from .worker import Worker
import cv2
import numpy as np
from time import sleep, time
import base64
import io
import imageio.v2 as imageio
import logging
from utils.utils import *
import binascii
from dotenv import load_dotenv
load_dotenv()


from .worker import Worker
app = Flask(__name__)
logger = logging.getLogger()
app.logger.addHandler(logging.StreamHandler(stdout))
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True

socketio = SocketIO(app, cors_allowed_origins="*")
worker = None
hair_artist = None
# vc = cv2.VideoCapture(0)
# if os.environ.get("FLASK_ENV") == "production":
#     origins = [
#         "http://actual-app-url.herokuapp.com",
#         "https://actual-app-url.herokuapp.com"
#     ]
# else:
#     origins = "*"
# socketio = SocketIO(app, cors_allowed_origins="*")
# camera = Camera(Hair_Artist())



@socketio.on('input image', namespace='/test')
def test_message(input):
    image = input.get("image", None)
    if not image:
        raise Exception("No image")
    image = image.split(",")[1]
    r, g, b = input.get("r"), input.get("g"), input.get("b")
    print([r,g,b])
    worker.enqueue_input((image, [r, g, b]))
    #camera.enqueue_input(input)

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

    # camera.enqueue_input(base64_to_pil_image(input))



@socketio.on('connect', namespace='/test')
def test_connect():
    print("client connected")
    global worker
    worker = init_camera()


def init_camera():
    global hair_artist
    hair_artist = Hair_Artist()
    return Worker(hair_artist)

@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')

@app.route('/salons', methods=['GET'])
@cross_origin()
def get_salons():
    args = request.args
    userLat = args.get("lat", default="", type=str)
    userlng = args.get("lng", default="", type=str)
    if not userLat or not userlng:
        return jsonify({'code': 'error'})
    apiKey = os.getenv('GOOGLE_API_KEY')
    try:
        nearbySearchAPI = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={userLat}%2C{userlng}&radius=1200&type=hair_care&keyword=salon&key={apiKey}"
    except Exception as e:
        return jsonify({'code': 'error'})
    payload={}
    headers = {}
    response = requests.request("GET", nearbySearchAPI, headers=headers, data=payload)
    results = response.json()['results']
    salons = []
    size = 0

    for result in results:
        salon = dict()
        salon['name'] = result['name']
        salon['lat'] = result['geometry']['location']['lat']
        salon['lng'] = result['geometry']['location']['lng']
        placeId = result['place_id']
        placeDetailsAPI = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={placeId}&key={apiKey}"
        placeDetails = None
        try:
            response = requests.request("GET", placeDetailsAPI, headers=headers, data=payload)
            placeDetails = response.json()['result']
        except Exception as e:
            print(e)
            continue
        salon['place_id'] = placeId
        salon['rating'] = result['rating']
        salon['user_ratings_total'] = result['user_ratings_total']
        if placeDetails:
            salon['address'] = placeDetails.get("formatted_address", '')
            salon['website'] = placeDetails.get('website','')
        size += 1
        salons.append(salon)
    return jsonify({'code': 'success', 'length': size, 'salons': salons})

@app.route('/clear')
@cross_origin()
def clear_cache():
    if worker:
        worker.clean_up()
    return jsonify({'code': 'success'})


def gen():
    """Video streaming generator function."""
    app.logger.info("starting to generate frames!")
    while True:

        # start = time()
        # read_return_code, frame = vc.read()
        # output = hair_artist.apply_hair_color(frame, "pink")
        # output = cv2.cvtColor(output, cv2.COLOR_BGR2RGB)
        # output_str = binascii.a2b_base64(cv2_image_to_base64(output))
        # print("Lapsed time: {}".format(time() - start))
        frame = worker.get_frame() #pil_image_to_base64(camera.get_frame())

        # frame = camera.get_frame() #pil_image_to_base64(camera.get_frame())

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
@cross_origin()
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    while not worker:
        sleep(0.05)
    return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    socketio.run(app, port=5001)
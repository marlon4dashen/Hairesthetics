import eventlet
eventlet.monkey_patch()
from sys import stdout
from hair_segmentation.hair_color.hair_artist import Hair_Artist
from salon_recommendation.SalonRecommendation import SalonRecommendation
import logging
from flask import Flask, render_template, Response, jsonify, request, make_response
from flask_socketio import SocketIO
from flask_cors import cross_origin
from .worker import Worker, ImageWorker
from time import sleep
import logging
import os
from dotenv import load_dotenv
load_dotenv()
from utils.utils import *


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

@app.route('/image', methods=['POST'])
@cross_origin()
def process_image():
    args = request.args
    files = request.files
    inputImage = files.get('imgFile', default=None)
    if not inputImage:
        return jsonify({'code': 'error'})
    global hair_artist
    if not hair_artist:
        hair_artist = Hair_Artist()
    r, g, b = args.get("r", 0), args.get("g", 0), args.get("b", 0)
    worker = ImageWorker(hair_artist)
    output_str = worker.process_one(inputImage, [r, g, b])
    response = make_response(output_str)
    response.headers['Content-Type'] = 'image/jpeg'
    return response        

@app.route('/salons', methods=['GET'])
@cross_origin()
def get_salons():
    args = request.args
    userLat = args.get("lat", default="", type=str)
    userlng = args.get("lng", default="", type=str)
    if not userLat or not userlng:
        return jsonify({'code': 'error'})
    try:
        api_key = os.getenv('GOOGLE_API_KEY')
        salon_handler = SalonRecommendation(userLat, userlng, api_key)
        salons = salon_handler.get_nearby_salons()
        size = salon_handler.get_size()
    except Exception as e:
        return jsonify({'code': 'error'})
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
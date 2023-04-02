# Import libraries
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


# Import necessary modules and packages
from .worker import Worker
app = Flask(__name__)
logger = logging.getLogger()
app.logger.addHandler(logging.StreamHandler(stdout))
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True

# Initialize SocketIO with CORS allowed origins and eventlet for async mode
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
workers = {} # Dictionary to store worker instances for each user
hair_artist = None # Hair_Artist instance




@socketio.on('input image', namespace='/test')
def test_message(input):
    """
    Receives the input image from the client, processes it, and sends it to the worker for further processing.
    The input contains the image data, user ID, and desired hair color.

    Args:
        input (dict): A dictionary containing the image and user ID.
    """
    # Extract image, user ID and desired color from the input
    image = input.get("image", None)
    userid = input.get("userid", None)
    if not image:
        raise Exception("No image")
    image = image.split(",")[1]
    r, g, b = input.get("r"), input.get("g"), input.get("b")
    
    # If the user ID exists in workers, enqueue the input to the corresponding worker
    if userid in workers:
        workers[userid].enqueue_input((image, [r, g, b]))
    

@socketio.on('connect', namespace='/test')
def test_connect():
    """
    Handles a new client connection.
    """
    print("new connection")


@socketio.on('add_user', namespace='/test')
def add_user(input):
    """
    Adds a new user to the list of active workers.

    Args:
        input (dict): A dictionary containing the user ID.
    """
    # Initialize worker and add to the list of active workers using the user ID as the key
    global workers
    worker = init_camera()
    userid = input.get("userid")
    workers[userid] = worker
    print(workers)

def init_camera():
    """
    Initialize the Hair_Artist instance if it hasn't been initialized yet.

    Returns:
        Worker: An instance of the Worker class.
    """
    global hair_artist
    if not hair_artist:
        hair_artist = Hair_Artist()
    return Worker(hair_artist)

@app.route('/')
def index():
    """
    Renders the home page of the application.
    """
    return render_template('index.html')

@app.route('/image', methods=['POST'])
@cross_origin()
def process_image():
    """
    Processes an input image received from the client.

    Returns:
        Response: A Response object containing the processed image.
    """
    # Get arguments and files from the request
    args = request.args
    files = request.files
    inputImage = files.get('imgFile', default=None)
    
    # Check if an input image exists, if not, return an error response
    if not inputImage:
        return jsonify({'code': 'error'})

    # Initialize Hair_Artist if not already initialized
    global hair_artist
    if not hair_artist:
        hair_artist = Hair_Artist()
    r, g, b = args.get("r", 0), args.get("g", 0), args.get("b", 0)
    
    # Create a worker to process the image and get the output
    worker = ImageWorker(hair_artist)
    output_str = worker.process_one(inputImage, [r, g, b])
    
    # Create a response containing the processed image and return it
    response = make_response(output_str)
    response.headers['Content-Type'] = 'image/jpeg'
    return response        

@app.route('/salons', methods=['GET'])
@cross_origin()
def get_salons():
    """
    Retrieves a list of nearby salons based on the user's latitude and longitude.

    Returns:
        Response: A Response object containing the list of salons.
    """

    # Get latitude and longitude from the request arguments
    args = request.args
    userLat = args.get("lat", default="", type=str)
    userlng = args.get("lng", default="", type=str)
    
    # If latitude or longitude is missing, return an error response
    if not userLat or not userlng:
        return jsonify({'code': 'error'})
    
    # Initialize the SalonRecommendation instance with the latitude, longitude, and API key
    try:
        api_key = os.getenv('GOOGLE_API_KEY')
        salon_handler = SalonRecommendation(userLat, userlng, api_key)
        
        # Get the list of nearby salons and their count
        salons = salon_handler.get_nearby_salons()
        size = salon_handler.get_size()
    except Exception as e:
        return jsonify({'code': 'error'})
        
    # Return a response containing the list of salons and their count
    return jsonify({'code': 'success', 'length': size, 'salons': salons})

@app.route('/clear', methods=['GET'])
@cross_origin()
def clear_cache():
    args = request.args
    userid = args["userid"]
    if userid in workers:
        workers[userid].clean_up()
        # del workers[userid]
    return jsonify({'code': 'success'})

@app.route('/remove', methods=['GET'])
@cross_origin()
def remove_worker():
    args = request.args
    userid = args["userid"]
    if userid in workers:
        del workers[userid]
    print(workers)
    return jsonify({'code': 'success'})

def gen(userid):
    """Video streaming generator function."""
    app.logger.info("starting to generate frames!")
    while True:

        # start = time()
        # read_return_code, frame = vc.read()
        # output = hair_artist.apply_hair_color(frame, "pink")
        # output = cv2.cvtColor(output, cv2.COLOR_BGR2RGB)
        # output_str = binascii.a2b_base64(cv2_image_to_base64(output))
        # print("Lapsed time: {}".format(time() - start))
        if userid in workers:
            frame = workers[userid].get_frame() #pil_image_to_base64(camera.get_frame())

        # frame = camera.get_frame() #pil_image_to_base64(camera.get_frame())

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')


@app.route('/video_feed')
@cross_origin()
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag."""
    args = request.args
    userid = args["userid"]
    
    while userid not in workers:
        sleep(0.05)
    return Response(gen(userid), mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':
    socketio.run(app, port=5001)
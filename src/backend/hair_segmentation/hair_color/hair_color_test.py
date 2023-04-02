import pytest
import cv2
import numpy as np
from model import model_utils
from my_module import *

@pytest.fixture
def test_image():
    """
    Fixture for generating a test image.
    """

    # Create a sample test image (100x100 black image with a white rectangle)
    image = np.zeros((100, 100, 3), dtype=np.uint8)
    image[10:30, 20:80, :] = 255
    return image

def test_initialize_mediapipe():
    """
    Test the mediapipe face detection sub-module initialization.
    """

    mpFaceDetection = initialize_mediapipe()

    # Check if the returned object is of the correct type
    assert isinstance(mpFaceDetection, mediapipe.solutions.face_detection.FaceDetection)

def test_initialize_hair_segmentation_model():
    """
    Test the hair segmentation model initialization.
    """
    hair_segmentation_model = 'path/to/model.pb'
    model = initialize_hair_segmentation_model(hair_segmentation_model)
    
    # Check if the returned object is of the correct type
    assert isinstance(model, model_utils.Model)

def test_perform_hair_segmentation(test_image):
    """
    Test the hair segmentation functionality.
    """

    # Define model input and output parameters
    input_name = 'input'
    input_width, input_height = 100, 100
    output_name = 'output'

    # Initialize a sample model session
    session = cv2.dnn_DetectionModel('path/to/model.pb', 'path/to/config.pbtxt')
    img = test_image

    # Perform hair segmentation on the test image
    masked_img = perform_hair_segmentation(
        session, input_name, input_width, input_height, output_name, img)

    # Check if the masked image is a NumPy array and has the correct shape
    assert isinstance(masked_img, np.ndarray)
    assert masked_img.shape == img.shape

    # Verify that the masked area in the image is black
    assert np.all(masked_img[10:30, 20:80, :] == [0, 0, 0])

def test_change_color(test_image):
    """
    Test the color changing functionality.
    """

    img = test_image

    # Create a binary mask of the same shape as the test image
    mask = np.zeros((100, 100), dtype=np.uint8)
    mask[10:30, 20:80] = 255
    target_color = [255, 0, 0]

    # Change the color of the masked area in the test image
    output = change_color(img, mask, target_color)

    # Check if the output image is a NumPy array and has the correct shape
    assert isinstance(output, np.ndarray)
    assert output.shape == img.shape

    # Verify that the masked area in the output image has the target color
    assert np.all(output[10:30, 20:80, :] == [255, 0, 0])

def test_change_hair_color(test_image):
    """
    Test the hair color changing functionality.
    """

    # Initialize the hair segmentation model
    hair_segmentation_model = 'path/to/model.pb'
    model = initialize_hair_segmentation_model(hair_segmentation_model)
    
    # Define model input and output parameters
    input_name = 'input'
    input_width, input_height = 100, 100
    output_names = ['output']

    # Initialize the mediapipe face detection sub-module
    mpFaceDetection = initialize_mediapipe()

    target_color = [255, 0, 0]

    # Change the hair color
    processed_frame = change_hair_color(
        test_image, target_color, model.session, input_name, input_width, input_height, output_names, mpFaceDetection)

    # Check if the processed frame is a NumPy array and has the correct shape
    assert isinstance(processed_frame, np.ndarray)
    assert processed_frame.shape == test_image.shape

    # Verify that the hair area in the processed frame has the target color
    assert np.all(processed_frame[10:30, 20:80, :] == [255, 0, 0])

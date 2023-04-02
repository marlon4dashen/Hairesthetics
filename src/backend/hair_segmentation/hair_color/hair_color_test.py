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
    
    hair_segmentation_model = 'path/to/model.pb'
    model = initialize_hair_segmentation_model(hair_segmentation_model)
    assert isinstance(model, model_utils.Model)

def test_perform_hair_segmentation(test_image):
    input_name = 'input'
    input_width, input_height = 100, 100
    output_name = 'output'
    session = cv2.dnn_DetectionModel('path/to/model.pb', 'path/to/config.pbtxt')
    img = test_image

    masked_img = perform_hair_segmentation(
        session, input_name, input_width, input_height, output_name, img)

    assert isinstance(masked_img, np.ndarray)
    assert masked_img.shape == img.shape
    assert np.all(masked_img[10:30, 20:80, :] == [0, 0, 0])

def test_change_color(test_image):
    img = test_image
    mask = np.zeros((100, 100), dtype=np.uint8)
    mask[10:30, 20:80] = 255
    target_color = [255, 0, 0]

    output = change_color(img, mask, target_color)

    assert isinstance(output, np.ndarray)
    assert output.shape == img.shape
    assert np.all(output[10:30, 20:80, :] == [255, 0, 0])

def test_change_hair_color(test_image):
    hair_segmentation_model = 'path/to/model.pb'
    model = initialize_hair_segmentation_model(hair_segmentation_model)
    input_name = 'input'
    input_width, input_height = 100, 100
    output_names = ['output']
    mpFaceDetection = initialize_mediapipe()

    target_color = [255, 0, 0]

    processed_frame = change_hair_color(
        test_image, target_color, model.session, input_name, input_width, input_height, output_names, mpFaceDetection)

    assert isinstance(processed_frame, np.ndarray)
    assert processed_frame.shape == test_image.shape
    assert np.all(processed_frame[10:30, 20:80, :] == [255, 0, 0])

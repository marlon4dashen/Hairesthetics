from PIL import Image
from . import hair_color
from model import model_utils
import cv2

class Hair_Artist(object):
    """
    Hair_Artist class for applying hair color changes to images.
    """

    def __init__(self):
        """
        Initialize the Hair_Artist object with face detection and hair segmentation models.
        """
        # Initialize the Mediapipe face detection module
        self.mpFace = hair_color.initialize_mediapipe()
        
        # Initialize the hair segmentation model
        self.model = hair_color.initialize_hair_segmentation_model('./model/best_model_simplifier.onnx')

    def apply_makeup(self, img):
        return cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        # return img.transpose(Image.FLIP_LEFT_RIGHT)

    def apply_hair_color(self, img, color):
        return hair_color.change_hair_color(img, color, self.model.session, 
            self.model.input_name, self.model.input_width, self.model.input_height, self.model.output_name, self.mpFace)


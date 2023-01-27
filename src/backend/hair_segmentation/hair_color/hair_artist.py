from PIL import Image
from . import hair_color
from model import model_utils

class Hair_Artist(object):
    def __init__(self):
        pass

    def apply_makeup(self, img):
        return img.transpose(Image.FLIP_LEFT_RIGHT)

    def apply_hair_color(self, img, color):
        return hair_color.change_hair_color(img, color)


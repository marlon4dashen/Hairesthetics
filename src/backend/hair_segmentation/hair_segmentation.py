
import os
import time
import torch
import datetime
from model.unet import unet
from utils.utils import *
import cv2
# import numpy as np

import torch.nn as nn
from torch.autograd import Variable
from torchvision.utils import save_image
from torchvision import transforms

import PIL
from PIL import Image


# preprocess the input image
def process_image(resize, totensor, normalize, centercrop, imsize):
    options = []
    if centercrop:
        options.append(transforms.CenterCrop(160))
    if resize:
        options.append(transforms.Resize(
            (imsize, imsize), interpolation=PIL.Image.Resampling.NEAREST))
    if totensor:
        options.append(transforms.ToTensor())
    if normalize:
        options.append(transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)))
    transform = transforms.Compose(options)
    return transform


# load the model and predict
def test(model_path, image_path, image_size):
    transform = process_image(True, True, True, False, image_size)
    model = unet()
    model.load_state_dict(torch.load(
        model_path, map_location=torch.device('cpu')))
    imgs = []
    img = transform(Image.open(image_path))
    imgs.append(img)
    imgs = torch.stack(imgs)
    labels_predict = model(imgs)
    labels_predict_plain = generate_label_plain(labels_predict, image_size)
    labels_predict_color = generate_label(labels_predict, image_size)
    cv2.imwrite(('./images/output.png'), labels_predict_plain[0])
    save_image(labels_predict_color[0], './images/output.png')


if __name__ == "__main__":
    # png doesnt work for now
    test('./model/model.pth', './images/test.jpg', 512)

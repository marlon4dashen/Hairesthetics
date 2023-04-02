# Import Libraries
import mediapipe
import cv2
import numpy as np
from model import model_utils


# Set constant values for preprocessing and post-processing
EXPANDING_FACTOR = 0.75
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]
ALPHA = 0.20

# To reduce Mediapipe false results increase the confidence level
MIN_CONFIDENCE_LEVEL = 0.5

# Define colors in BGR format
COLORS = {
    "brown": [139, 69, 13],
    "pink": [255, 192, 203],
    "darkgrey": [169, 169, 169],
    "white": [255, 255, 255],
    "purple": [148, 0, 211],
    "green": [60, 179, 113],
    "orange": [255, 165, 0],
    "cyan": [0, 206, 209],
    "darkred": [139, 0, 0]
}


def initialize_mediapipe():
    """
    Initializing mediapipe face detection sub-module
    """

    # nEnable face detection with a minimum confidence level
    mpFaceDetection = mediapipe.solutions.face_detection.FaceDetection(
        MIN_CONFIDENCE_LEVEL)

    return mpFaceDetection


def initialize_hair_segmentation_model(hair_segmentation_model):
    """
    Initialize the hair segmentation model.
    """

    model = model_utils.Model(hair_segmentation_model)
    return model


def perform_hair_segmentation(session, input_name, input_width, input_height, output_name, img):
    """
    Run inference on the preprocessed image to segment hair
    """

    # nPrepare input image (resize, convert color format, normalize, and transpose)
    img_height, img_width, img_channels = img.shape

    # nConvert the image to RGB format
    input_image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # nResize the image based based on the model shape
    input_image = cv2.resize(input_image, (input_width, input_height))

    # nPass the preprocessed image to the model for inference
    # nVGG networks are trained on images with each channel normalized by mean and std.
    # nNormalize image before processing

    input_image = (input_image / 255 - MEAN) / STD
    # nChange H*W*C to C*W*H (H - Height / W - Width / C - Channels)
    input_image = input_image.transpose(2, 0, 1)
    input_tensor = np.expand_dims(input_image, axis=0)

    # nConvert to float type
    input_tensor = input_tensor.astype(np.float32)

    # nPerform inference on the image
    outputs = session.run([output_name], {input_name: input_tensor})

    # nProcess output data
    hair_mask = np.squeeze(outputs[0])
    hair_mask = hair_mask.transpose(1, 2, 0)
    hair_mask = hair_mask[:, :, 2]
    hair_mask = cv2.resize(hair_mask, (img_width, img_height))
    hair_mask = np.round(hair_mask).astype(np.uint8)

    # nApply mask to the original image
    masked_img = cv2.bitwise_or(img, img, mask=hair_mask)

    return masked_img


def change_color(img, mask, target_color):

    # nCreate a copy of the original image
    colored_hair = np.copy(img)

    # nChange color of the masked area
    colored_hair[(mask > 0).all(axis=2)] = target_color

    # nBlend the original image and colored image
    output = cv2.addWeighted(colored_hair, ALPHA, img,
                             1-ALPHA, 0.5, colored_hair)
    return output


def change_hair_color(img, target_color, session, input_name, input_width, input_height, output_names, mpFaceDetection):
    """
    Change Hair Color
    """

    # nPreserve a copy of the original
    frame = img.copy()

    # nconvert the color of the masked image from bgr to rgb
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # nDetect faces using the rgb frame
    faces = mpFaceDetection.process(rgb_frame)

    # nPerform hair segmentation on the image
    masked_img = perform_hair_segmentation(
        session, input_name, input_width, input_height, output_names, frame)

    # nChange the color of the segmented hair area
    processed_frame = change_color(
        img=frame, mask=masked_img, target_color=target_color)

    # nReturn the processed image with the new hair color
    label = "Changing hair color to {}".format(target_color)
    return processed_frame



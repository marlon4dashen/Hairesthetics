# Import Libraries
import os
import argparse
import uuid
import mediapipe
import cv2
import filetype
import numpy as np
# import config
import webcolors
import onnxruntime

HAIR_SEGMENTATION_MODEL = './model/best_model_simplifier.onnx'
EXPANDING_FACTOR = 0.75
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]
ALPHA = 0.4

# BGR Format
COLORS = {
    "brown": [19, 69, 139],
    "pink": [180, 105, 255],
    "darkgrey": [169, 169, 169],
    "white": [255, 255, 255],
    "purple": [211, 0, 148],
    "green": [113, 179, 60],
    "orange": [0, 165, 255],
    "cyan": [209, 206, 0],
    "darkred": [0, 0, 139],
}


# To reduce Mediapipe false results increase the confidence level
MIN_CONFIDENCE_LEVEL = 0.5


def initialize_mediapipe():
    """
    Initializing mediapipe face detection sub-module
    """
    # Enable face detection
    mpFaceDetection = mediapipe.solutions.face_detection.FaceDetection(
        MIN_CONFIDENCE_LEVEL)

    return mpFaceDetection


# def find_closest_color(req_color):
#     # This is the function which converts an RGB pixel to a color name
#     min_colours = {}
#     for name, key in webcolors.CSS3_HEX_TO_NAMES.items():
#         r_c, g_c, b_c = webcolors.hex_to_rgb(name)
#         rd = (r_c - req_color[0]) ** 2
#         gd = (g_c - req_color[1]) ** 2
#         bd = (b_c - req_color[2]) ** 2
#         min_colours[(rd + gd + bd)] = key
#         closest_name = min_colours[min(min_colours.keys())]
#     return closest_name


# def enlarge_bounding_box(x, y, w, h):
#     """
#     Enlarge the bounding box based on the expanding factor
#     """
#     # create a larger bounding box with buffer around keypoints
#     x1 = int(x - EXPANDING_FACTOR * w)
#     w1 = int(w + 2 * EXPANDING_FACTOR * w)
#     y1 = int(y - EXPANDING_FACTOR * h)
#     h1 = int(h + 2 * EXPANDING_FACTOR * h)
#     #print('x1,y1,w1,h1', x1, y1, w1, h1)
#     x1 = 0 if x1 < 0 else x1
#     y1 = 0 if y1 < 0 else y1
#     #print('x1,y1,w1,h1', x1, y1, w1, h1)
#     return x1, y1, w1, h1


def initialize_hair_segmentation_model(hair_segmentation_model):
    # Initialize Model and start inference session
    # Inference session is used to load and run an ONNX model as well to specify
    # environment and configuration options.
    session = onnxruntime.InferenceSession(hair_segmentation_model)

    # The ONNX session consumes and produces data
    # Query the model metadata
    # Get the definition of the inputs metadata
    input_name, input_type, input_shape = session.get_inputs()[0].name, \
        session.get_inputs()[0].type, \
        session.get_inputs()[0].shape
    input_height, input_width = input_shape[2], input_shape[3]

    print(f'Input Details: Name={input_name} -- Type={input_type} '
          f'-- Shape={input_shape} -- Height={input_height} -- Width={input_width}')

    # Get the definition of the outputs metadata
    output_name, output_type, output_shape = session.get_outputs()[0].name, \
        session.get_outputs()[0].type, \
        session.get_outputs()[0].shape

    output_height, output_width = output_shape[2], output_shape[3]
    print(f'Output Details: Name={output_name} -- Type={input_type} '
          f'--Shape={output_shape} -- Height={output_height} -- Width={output_width}')

    return session, input_name, input_width, input_height, output_name


def perform_hair_segmentation(session, input_name, input_width, input_height, output_name, img):
    """
    Run inference on the preprocessed image to segment hair
    """
    # Prepare Input
    img_height, img_width, img_channels = img.shape
    # Convert the image to RGB format
    input_image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    # Resize the image based based on the model shape
    input_image = cv2.resize(input_image, (input_width, input_height))

    # Pass the preprocessed image to the model for inference
    # VGG networks are trained on images with each channel normalized by mean and std.
    # Normalize image before processing

    input_image = (input_image / 255 - MEAN) / STD
    # Change H*W*C to C*W*H (H - Height / W - Width / C - Channels)
    input_image = input_image.transpose(2, 0, 1)
    input_tensor = np.expand_dims(input_image, axis=0)
    # Convert to float type
    input_tensor = input_tensor.astype(np.float32)

    ####################################################################
    # Perform inference on the image
    outputs = session.run([output_name], {input_name: input_tensor})
    ####################################################################

    # Process output data
    hair_mask = np.squeeze(outputs[0])
    hair_mask = hair_mask.transpose(1, 2, 0)
    hair_mask = hair_mask[:, :, 2]
    hair_mask = cv2.resize(hair_mask, (img_width, img_height))
    hair_mask = np.round(hair_mask).astype(np.uint8)

    masked_img = cv2.bitwise_or(img, img, mask=hair_mask)

    print(hair_mask.shape)
    print(hair_mask)

    # debug
    # cv2.imshow("masked_img", hair_mask)
    # cv2.waitKey(0)
    return masked_img


def change_color(img, mask, target_color):
    # Resize the segmented hair region
    # hair_region = cv2.resize(
    #     mask, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_AREA)
    # mask_color = hair_region.copy()
    # # Consider only colored area
    # cond = np.where((hair_region > 0).all(axis=2))
    # # Colorize the mask representing the hair area with the new color.
    # mask_color[cond] = target_color
    # # Maintain the natural look of the hair
    # mask_color1 = cv2.add(img, mask_color)
    # #mask_color1 = mask_color

    # # Overlay the segmented and processed hair region on top of the original image
    # cond = np.stack((hair_region,)*3, axis=-1) > 0
    # cond = cond[..., 0]
    # # Combine both images where the condition is satisfied
    # output = np.where(cond == False, img, mask_color1)
    # return output
    colored_hair = np.copy(img)
    colored_hair[(mask > 0).all(axis=2)] = target_color
    output = cv2.addWeighted(colored_hair, ALPHA, img,
                             1-ALPHA, 0, colored_hair)
    return output


def change_hair_color(target_color):
    """
    Change Hair Color
    """
    # Initialize mediapipe face detection sub-module
    mpFaceDetection = initialize_mediapipe()
    session, input_name, input_width, input_height, output_names = initialize_hair_segmentation_model(
        HAIR_SEGMENTATION_MODEL)

    # Read Input Image
    cap = cv2.VideoCapture(0)
    while True:
        success, img = cap.read()
        # img = cv2.imread(input_path)

        # Preserve a copy of the original
        frame = img.copy()

        # convert from bgr to rgb
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Detect faces using the rgb frame
        faces = mpFaceDetection.process(rgb_frame)

        output = []
        output_info = []

        # Loop over the faces detected
        if faces.detections:
            # append output
            output_msg = {'msg': "{} face(s) detected.".format(
                len(faces.detections)), 'category': "info"}
            output_info.append(output_msg)
            for idx, face_detected in enumerate(faces.detections):
                # Output message
                label = f"Face ID = {(idx+1)} - Detection Score {int(face_detected.score[0]*100)}%"
                output_msg = {'msg': label, 'category': "info"}
                output_info.append(output_msg)
                print(output_msg.get('category'), output_msg.get('msg'))

                # Get the face relative bounding box
                # relativeBoundingBox = face_detected.location_data.relative_bounding_box
                # frameHeight, frameWidth, frameChannels = frame.shape
                # faceBoundingBox = int(relativeBoundingBox.xmin*frameWidth), int(relativeBoundingBox.ymin*frameHeight), int(
                #     relativeBoundingBox.width*frameWidth), int(relativeBoundingBox.height*frameHeight)
                # # Get the coordinates of the face bounding box
                # x, y, w, h = faceBoundingBox
                # # Enlarge the bounding box
                # x1, y1, w1, h1 = enlarge_bounding_box(x, y, w, h)
                # # Crop out the enlarged region
                # roi_face_color = frame[y1:y1 + h1, x1:x1 + w1]

                masked_img = perform_hair_segmentation(
                    session, input_name, input_width, input_height, output_names, frame)
                # Change the color of the segmented hair area
                processed_frame = change_color(
                    img=frame, mask=masked_img, target_color=COLORS[target_color])

                label = "Changing hair color to {}".format(target_color)
                print(label)
                cv2.imshow("Hair segmentation", processed_frame)
                if cv2.waitKey(1) & 0xFF == 27:
                    exit(0)
    ######################
    # write output
    # output_filepath = os.path.join('./outputs',
    #                                str(uuid.uuid4().hex) + os.path.splitext(input_path)[1])
    # cv2.imwrite(output_filepath, processed_frame)
    #     output_item = {'id': 1, 'folder': './outputs'
    #                           , 'name': os.path.basename(output_filepath)
    #                           , 'msg': label}
    #     output.append(output_item)
    #     ######################
    #     if display_output:
    #        # Display Image on screen
    #        cv2.imshow(f"Face {(idx+1)}", processed_frame)
    #        cv2.waitKey(0)
    # if display_output:
    #    # Cleanup
    #    cv2.destroyAllWindows()
    # mpFaceDetection.close()
    # return output_info , output


def is_valid_path(path):
    """
    Validates the path inputted and makes sure that is a file of type image
    """
    if not path:
        raise ValueError(f"Invalid Path")
    if os.path.isfile(path) and 'image' in filetype.guess(path).mime:
        return path
    else:
        raise ValueError(f"Invalid Path {path}")


def parse_args():
    """
    Get user command line parameters
    """
    parser = argparse.ArgumentParser(description="Available Options")

    parser.add_argument('-c', '--hair_color', dest='hair_color', default=False,
                        required=True, help="Enter the color of hair you want to change")

    args = vars(parser.parse_args())

    # To Display The Command Line Arguments
    print("## Command Arguments #################################################")
    print("\n".join("{}:{}".format(i, j) for i, j in args.items()))
    print("######################################################################")

    return args


if __name__ == '__main__':
    # Parsing command line arguments entered by user

    args = parse_args()
    change_hair_color(
        target_color=args['hair_color'])
    change_hair_color()

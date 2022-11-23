#Import Libraries
import os,argparse,uuid
import mediapipe,cv2,filetype
import numpy as np
# import config
import webcolors
import onnxruntime

HAIR_SEGMENTATION_MODEL     = './model/best_model_simplifier.onnx'
EXPANDING_FACTOR            = 0.75
TARGET_COLOR                = [0,100,10] #[255,255,255] #BGR Format

#To reduce Mediapipe false results increase the confidence level
MIN_CONFIDENCE_LEVEL = 0.5

def initialize_mediapipe():
    """
    Initializing mediapipe face detection sub-module
    """
    #Enable face detection
    mpFaceDetection = mediapipe.solutions.face_detection.FaceDetection(MIN_CONFIDENCE_LEVEL)

    return mpFaceDetection

def find_closest_color(req_color):
        # This is the function which converts an RGB pixel to a color name
        min_colours = {}
        for name, key in webcolors.CSS3_HEX_TO_NAMES.items():
            r_c, g_c, b_c = webcolors.hex_to_rgb(name)
            rd = (r_c - req_color[0]) ** 2
            gd = (g_c - req_color[1]) ** 2
            bd = (b_c - req_color[2]) ** 2
            min_colours[(rd + gd + bd)] = key
            closest_name = min_colours[min(min_colours.keys())]
        return closest_name

def enlarge_bounding_box(x, y, w, h):
    """
    Enlarge the bounding box based on the expanding factor
    """
    # create a larger bounding box with buffer around keypoints
    x1 = int(x - EXPANDING_FACTOR * w)
    w1 = int(w + 2 * EXPANDING_FACTOR * w)
    y1 = int(y - EXPANDING_FACTOR * h)
    h1 = int(h + 2 * EXPANDING_FACTOR * h)
    #print('x1,y1,w1,h1', x1, y1, w1, h1)
    x1 = 0 if x1 < 0 else x1
    y1 = 0 if y1 < 0 else y1
    #print('x1,y1,w1,h1', x1, y1, w1, h1)
    return x1,y1,w1,h1

def initialize_hair_segmentation_model(hair_segmentation_model):
    # Initialize Model and start inference session
    # Inference session is used to load and run an ONNX model as well to specify
    # environment and configuration options.
    session = onnxruntime.InferenceSession(hair_segmentation_model)

    # The ONNX session consumes and produces data
    # Query the model metadata
    # Get the definition of the inputs metadata
    input_name,input_type,input_shape   = session.get_inputs()[0].name, \
                                          session.get_inputs()[0].type, \
                                          session.get_inputs()[0].shape
    input_height,input_width = input_shape[2],input_shape[3]

    print(f'Input Details: Name={input_name} -- Type={input_type} '
          f'-- Shape={input_shape} -- Height={input_height} -- Width={input_width}')

    # Get the definition of the outputs metadata
    output_name,output_type,output_shape = session.get_outputs()[0].name, \
                                           session.get_outputs()[0].type, \
                                           session.get_outputs()[0].shape

    output_height,output_width = output_shape[2],output_shape[3]
    print(f'Output Details: Name={output_name} -- Type={input_type} '
          f'--Shape={output_shape} -- Height={output_height} -- Width={output_width}')

    return session,input_name,input_width, input_height,output_name

def perform_hair_segmentation(session,input_name,input_width, input_height,output_name,img):
    """
    Run inference on the preprocessed image to segment hair
    """
    #Prepare Input
    img_height, img_width, img_channels = img.shape
    #Convert the image to RGB format
    input_image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    #Resize the image based based on the model shape
    input_image = cv2.resize(input_image, (input_width, input_height))

    # Pass the preprocessed image to the model for inference
    #VGG networks are trained on images with each channel normalized by mean and std.
    #Normalize image before processing
    mean = [0.485, 0.456, 0.406]
    std = [0.229, 0.224, 0.225]
    input_image = (input_image / 255 - mean) / std
    #Change H*W*C to C*W*H (H - Height / W - Width / C - Channels)
    input_image  = input_image.transpose(2, 0, 1)
    input_tensor = input_image[np.newaxis, :, :, :]
    #Convert to float type
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

    masked_img = cv2.bitwise_or(img,img , mask=hair_mask)
    #cv2.imshow("masked_img", masked_img)
    #cv2.waitKey(0)
    return masked_img

def change_color(img,mask,target_color):
    #Resize the segmented hair region
    hair_region = cv2.resize(mask, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_AREA)
    mask_color = hair_region.copy()
    #Consider only colored area
    cond = np.where((hair_region>0).all(axis=2))
    #Colorize the mask representing the hair area with the new color.
    mask_color[cond] = target_color
    #Maintain the natural look of the hair
    mask_color1 = cv2.add(img ,mask_color)
    #mask_color1 = mask_color

    #Overlay the segmented and processed hair region on top of the original image
    cond = np.stack((hair_region,)*3,axis=-1)>0
    cond = cond[...,0]
    #Combine both images where the condition is satisfied
    output = np.where(cond==False, img, mask_color1)
    return output

def change_hair_color():
    """
    Change Hair Color
    """
    #Initialize mediapipe face detection sub-module
    mpFaceDetection = initialize_mediapipe()
    session,input_name,input_width,input_height,output_names = initialize_hair_segmentation_model(HAIR_SEGMENTATION_MODEL)

    # Read Input Image
    cap = cv2.VideoCapture(0)
    while True:
        success, img = cap.read()
        # img = cv2.imread(input_path)

        # Preserve a copy of the original
        frame = img.copy()

        # Convert the image from BGR to RGB format
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Detect faces using the rgb frame
        faces = mpFaceDetection.process(rgb_frame)

        output      = []
        output_info = []

        #Output message the number of faces detected...
        # output_msg = {'msg':"{} face(s) detected.".format(len(faces.detections)),'category':"info"}
        # output_info.append(output_msg)

        #Find the name of the selected color
        closest_color_name = find_closest_color(
            (
                int(TARGET_COLOR[2])
                , int(TARGET_COLOR[1])
                , int(TARGET_COLOR[0])
            ))
        print('closest_color_name', closest_color_name)

        # Loop over the faces detected
        for idx, face_detected in enumerate(faces.detections):
            #Output message
            label = f"Face ID = {(idx+1)} - Detection Score {int(face_detected.score[0]*100)}%"
            output_msg = {'msg': label,'category': "info"}
            output_info.append(output_msg)
            print(output_msg.get('category'), output_msg.get('msg'))

            #Get the face relative bounding box
            relativeBoundingBox = face_detected.location_data.relative_bounding_box
            frameHeight,frameWidth,frameChannels = frame.shape
            faceBoundingBox = int(relativeBoundingBox.xmin*frameWidth)  \
                            ,int(relativeBoundingBox.ymin*frameHeight) \
                            ,int(relativeBoundingBox.width*frameWidth) \
                            ,int(relativeBoundingBox.height*frameHeight)
            #Get the coordinates of the face bounding box
            x, y, w, h = faceBoundingBox
            # Enlarge the bounding box
            x1,y1,w1,h1 = enlarge_bounding_box(x, y, w, h)
            #Crop out the enlarged region
            roi_face_color = frame[y1:y1 + h1, x1:x1 + w1]

            masked_img = perform_hair_segmentation(session, input_name, input_width, input_height, output_names, roi_face_color)
            #Change the color of the segmented hair area
            processed_frame = change_color(img=roi_face_color,mask=masked_img,target_color=TARGET_COLOR)

            label = "Changing hair color to {}".format(closest_color_name)
            print(label)
            ######################
            # output_filepath = os.path.join('./outputs',
            #                                str(uuid.uuid4().hex) + os.path.splitext(input_path)[1])
            # cv2.imwrite(output_filepath, processed_frame)
            cv2.imshow("Hair segmentation", processed_frame)
            if cv2.waitKey(5) & 0xFF == 27:
                break
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

    parser.add_argument('-i'
                       ,'--input_path'
                       ,dest='input_path'
                       ,type=is_valid_path
                       ,required=True
                       ,help = "Enter the path of the image file to process")

    parser.add_argument('-d'
                        , '--display_output'
                        , dest='display_output'
                        , default=False
                        , type=lambda x: (str(x).lower() in ['true', '1', 'yes'])
                        , help="Display output on screen")

    args = vars(parser.parse_args())

    #To Display The Command Line Arguments
    print("## Command Arguments #################################################")
    print("\n".join("{}:{}".format(i,j) for i,j in args.items()))
    print("######################################################################")

    return args

if __name__ == '__main__':
    # Parsing command line arguments entered by user

    # args = parse_args()
    # change_hair_color(input_path  = args['input_path'],display_output=args['display_output'])
    change_hair_color()


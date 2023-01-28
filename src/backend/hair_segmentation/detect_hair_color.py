#Import Libraries
import os,argparse,uuid
import mediapipe,cv2,filetype
import numpy as np
# import config
import webcolors
from sklearn.cluster import KMeans
from collections import Counter
import onnxruntime

HAIR_SEGMENTATION_MODEL     = './model/best_model_simplifier.onnx'

#To reduce Mediapipe false results increase the confidence level
MIN_CONFIDENCE_LEVEL = 0.5

EXPANDING_FACTOR            = 0.75

def initialize_mediapipe():
    """
    Initializing mediapipe face detection sub-module
    """
    #Enable face detection
    mpFaceDetection = mediapipe.solutions.face_detection.FaceDetection(MIN_CONFIDENCE_LEVEL)

    return mpFaceDetection


def remove_black_areas(estimator_labels, estimator_cluster):
    """
    Remove out the black pixel from skin area extracted
    By default OpenCV does not handle transparent images and replaces those with zeros (black).
    Useful when thresholding is used in the image.
    """
    # Check for black
    hasBlack = False

    # Get the total number of occurence for each color
    occurence_counter = Counter(estimator_labels)

    # Quick lambda function to compare to lists
    compare = lambda x, y: Counter(x) == Counter(y)

    # Loop through the most common occuring color
    for x in occurence_counter.most_common(len(estimator_cluster)):

        # Quick List comprehension to convert each of RBG Numbers to int
        color = [int(i) for i in estimator_cluster[x[0]].tolist()]

        # Check if the color is [0,0,0] that if it is black
        if compare(color, [0, 0, 0]) == True:
            # delete the occurence
            del occurence_counter[x[0]]
            # remove the cluster
            hasBlack = True
            estimator_cluster = np.delete(estimator_cluster, x[0], 0)
            break

    return (occurence_counter, estimator_cluster, hasBlack)


def get_color_information(estimator_labels, estimator_cluster, hasThresholding=False):
    """
    Extract color information based on predictions coming from the clustering.
    Accept as input parameters estimator_labels (prediction labels)
                               estimator_cluster (cluster centroids)
                               has_thresholding (indicate whether a mask was used).
    Return an array the extracted colors.
    """
    # Variable to keep count of the occurence of each color predicted
    occurence_counter = None

    # Output list variable to return
    colorInformation = []

    # Check for Black
    hasBlack = False

    # If a mask has be applied, remove th black
    if hasThresholding == True:

        (occurence, cluster, black) = remove_black_areas(estimator_labels, estimator_cluster)
        occurence_counter = occurence
        estimator_cluster = cluster
        hasBlack = black

    else:
        occurence_counter = Counter(estimator_labels)

    # Get the total sum of all the predicted occurences
    totalOccurence = sum(occurence_counter.values())

    # Loop through all the predicted colors
    for x in occurence_counter.most_common(len(estimator_cluster)):
        index = (int(x[0]))

        # Quick fix for index out of bound when there is no threshold
        index = (index - 1) if ((hasThresholding & hasBlack) & (int(index) != 0)) else index

        # Get the color number into a list
        color = estimator_cluster[index].tolist()

        # Get the percentage of each color
        color_percentage = (x[1] / totalOccurence)

        # make the dictionay of the information
        colorInfo = {"cluster_index": index, "color": color, "color_percentage": color_percentage}

        # Add the dictionary to the list
        colorInformation.append(colorInfo)

    return colorInformation


def extract_dominant_colors(image, number_of_colors=5, hasThresholding=False):
    """
    Putting all together.
    Accept as input parameters image -> the input image in BGR format (8 bit / 3 channel)
                                     -> the number of colors to extracted.
                                     -> hasThresholding indicate whether a thresholding mask was used.
    Leverage machine learning by using an unsupervised clustering algorithm (Kmeans Clustering) to cluster the
    image pixels data based on their RGB values.
    """
    # Quick Fix Increase cluster counter to neglect the black(Read Article)
    if hasThresholding == True:
        number_of_colors += 1

    # Taking Copy of the image
    img = image.copy()

    # Convert Image into RGB Colours Space
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Reshape Image
    img = img.reshape((img.shape[0] * img.shape[1]), 3)

    # Initiate KMeans Object
    estimator = KMeans(n_clusters=number_of_colors, random_state=0)

    # Fit the image
    estimator.fit(img)

    # Get Colour Information
    colorInformation = get_color_information(estimator.labels_, estimator.cluster_centers_, hasThresholding)
    return colorInformation


def get_top_dominant_color(dominant_colors):
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

    #print(dominant_colors[0].get('cluster_index'))
    #print(dominant_colors[0].get('color'))
    #print(dominant_colors[0].get('color_percentage'))

    color_value = (
                   int(dominant_colors[0].get('color')[2])
                 , int(dominant_colors[0].get('color')[1])
                 , int(dominant_colors[0].get('color')[0])
                  )
    closest_color_name = find_closest_color(
            (
            int(dominant_colors[0].get('color')[0])
           ,int(dominant_colors[0].get('color')[1])
           ,int(dominant_colors[0].get('color')[2])
            )
        )
    color_score = round( dominant_colors[0].get('color_percentage') * 100,2)

    return color_value, closest_color_name, color_score

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
    # Convert the image to RGB format
    input_image = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    #Resize the image based based on the model shape
    input_image = cv2.resize(input_image, (input_width, input_height))

    #Pass the preprocessed image to the model for inference
    #VGG networks are trained on images with each channel normalized by mean and std.
    #Normalize image before processing
    mean = [0.485, 0.456, 0.406]
    std = [0.229, 0.224, 0.225]
    input_image = (input_image / 255 - mean) / std
    # Change H*W*C to C*W*H (H - Height / W - Width / C - Channels)
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
    cv2.imwrite(('./images/output1.png'), masked_img)
    # cv2.imshow("masked_img", masked_img)
    # cv2.waitKey(0)
    exit(0)
    return masked_img

def detect_hair_color(input_path:str,display_output:bool = False):
    """
    Detect Hair Color
    """
    #Initialize mediapipe face detection sub-module
    mpFaceDetection = initialize_mediapipe()

    session,input_name,input_width,input_height,output_names = initialize_hair_segmentation_model(HAIR_SEGMENTATION_MODEL)

    # Read Input Image
    img = cv2.imread(input_path)

    # Preserve a copy of the original
    frame = img.copy()

    # Convert the image from BGR to RGB format
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Detect faces using the rgb frame
    faces = mpFaceDetection.process(rgb_frame)

    output      = []
    output_info = []

    #Output message the number of faces detected...
    output_msg = {'msg':"{} face(s) detected.".format(len(faces.detections)),'category':"info"}
    output_info.append(output_msg)

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

        #Enlarge the bounding box
        x1, y1, w1, h1 = enlarge_bounding_box(x, y, w, h)
        #Crop out the enlarged region for better analysis
        roi_face_color = frame[y1:y1 + h1, x1:x1 + w1]

        masked_img = perform_hair_segmentation(session, input_name, input_width, input_height, output_names, roi_face_color)

        dominant_colors = extract_dominant_colors(masked_img,number_of_colors=5,hasThresholding=True)
        #print('dominantColors',dominant_colors)
        #prety_print_data(dominant_colors)

        color_value, closest_color_name, color_score = get_top_dominant_color(dominant_colors)

        label = "{}-{:.0f}%".format(closest_color_name,color_score)
        print(label)
        ######################
        output_filepath = os.path.join(config.PROCESSED_PATH,
                                       str(uuid.uuid4().hex) + os.path.splitext(input_path)[1])
        cv2.imwrite(output_filepath, roi_face_color)
        output_item = {'id': 1, 'folder': config.PROCESSED_FOLDER, 'name': os.path.basename(output_filepath),
                       'msg': os.path.basename(output_filepath)}
        output.append(output_item)

        output_filepath = os.path.join(config.PROCESSED_PATH,
                                       str(uuid.uuid4().hex) + os.path.splitext(input_path)[1])
        cv2.imwrite(output_filepath, masked_img)
        output_item = {'id': 2, 'folder': config.PROCESSED_FOLDER, 'name': os.path.basename(output_filepath),
                       'msg': label}
        output.append(output_item)
        ######################

        if display_output:
           # Display Image on screen
           cv2.imshow(f"Face {(idx+1)}",  roi_face_color)
           cv2.waitKey(0)
           cv2.imshow(label, masked_img)
           cv2.waitKey(0)

    if display_output:
       # Cleanup
       cv2.destroyAllWindows()
    mpFaceDetection.close()
    return output_info , output


def is_valid_path(path):
    """
    Validates the path inputted and makes sure that is a file of type image
    """
    return path
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
    import os
    print(os.getcwd())
    args = parse_args()
    detect_hair_color(input_path  = args['input_path'],display_output=args['display_output'])
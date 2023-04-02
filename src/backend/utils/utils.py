from PIL import Image
from io import BytesIO
import numpy
import base64

# Function to convert a given OpenCV (cv2) image to a base64-encoded string.
def cv2_image_to_base64(cv_img):
    # Convert the OpenCV image to a PIL image.
    im_pil = Image.fromarray(cv_img)

    # Create a BytesIO buffer to hold the image data.
    buf = BytesIO()

    # Save the PIL image in JPEG format to the buffer.
    im_pil.save(buf, format="JPEG")

    # Encode the buffer contents as a base64-encoded string and return it.
    return base64.b64encode(buf.getvalue())

# Function to convert a given base64-encoded image string to an OpenCV (cv2) image.
def base64_to_cv2_image(base64_img):
    # Decode the base64 string and open the resulting image using PIL.
    img = Image.open(BytesIO(base64.b64decode(base64_img)))
    
    # Convert the PIL image to a numpy array (OpenCV image format) and return it.
    return numpy.array(img) 

# Function to convert a given image bytes object to an OpenCV (cv2) image.
def bytes_to_cv2_image(bytes_img):
    # Open the image bytes using PIL and convert it to a numpy array (OpenCV image format).
    return numpy.array(Image.open(bytes_img))

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
    img = Image.open(BytesIO(base64.b64decode(base64_img)))
    return numpy.array(img) 

def bytes_to_cv2_image(bytes_img):
    return numpy.array(Image.open(bytes_img))

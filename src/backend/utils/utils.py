from PIL import Image
from io import BytesIO
import numpy
import base64


def cv2_image_to_base64(cv_img):
    im_pil = Image.fromarray(cv_img)
    buf = BytesIO()
    im_pil.save(buf, format="JPEG")
    return base64.b64encode(buf.getvalue())


def base64_to_cv2_image(base64_img):
    img = Image.open(BytesIO(base64.b64decode(base64_img)))
    return numpy.array(img) 

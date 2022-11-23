import tensorflow as tf
import cv2
import numpy as np


def predict(model, image, height=224, width=224):
    im = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    im = im / 255
    im = cv2.resize(im, (height, width))
    im = im.reshape((1,) + im.shape)

    pred = model.predict(im)

    mask = pred.reshape((224, 224))

    return mask


def transfer(image, mask):
    mask[mask > 0.5] = 255
    mask[mask <= 0.5] = 0

    mask = cv2.resize(mask, (image.shape[1], image.shape[0]))

    mask_n = np.zeros_like(image)
    mask_n[:, :, 0] = mask

    alpha = 0.6
    beta = (1.0 - alpha)
    dst = cv2.addWeighted(image, alpha, mask_n, beta, 0.0)

    return dst


def getHead(hog_face_detector, image):
    faces_hog = hog_face_detector(image, 1)

    heads = []
    
    for face in faces_hog:
        
        head = dict()
        
        head["left"] = max(face.left() - 300, 0)
        head["top"] = max(face.top() - 300, 0)
        head["right"] = min(face.right() + 300, image.shape[0])
        head["bottom"] = min(face.bottom() + 300, image.shape[1])
        
        heads.append(head)

    return heads


if __name__ == "__main__":
    
    model = tf.keras.models.load_model('./model/model.h5')
    model.summary()
    
    # img = cv2.imread('./images/test1.jpeg')
    # mask = predict(model, img)

    # dst = transfer(img, mask)
    # cv2.imshow("Hair segmentation", dst)
    # cv2.waitKey(0)
    
    cap = cv2.VideoCapture(0)
    while True:
        success, img = cap.read()
    
        mask = predict(model, img)
    
        dst = transfer(img, mask)
    
        cv2.imshow("Hair segmentation", dst)
        if cv2.waitKey(1) & 0xFF == 27:
            exit(0)
    
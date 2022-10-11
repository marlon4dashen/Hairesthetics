# IMPORTING LIBRARIES
import cv2
import mediapipe as mp

# INITIALIZING OBJECTS
MP_DRAWING = mp.solutions.drawing_utils
MP_DRAWING_STYLE = mp.solutions.drawing_styles
MP_FACE_MESH = mp.solutions.face_mesh
FACE_MESH_ENGINE = MP_FACE_MESH.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)
DRAWING_SPEC = MP_DRAWING.DrawingSpec(thickness=1, circle_radius=1)


def read_face_mesh(img):
    # DETECT THE FACE LANDMARKS

    # Flip the image horizontally and convert the color space from BGR to RGB
    img = cv2.cvtColor(cv2.flip(img, 1), cv2.COLOR_BGR2RGB)

    # To improve performance
    img.flags.writeable = False

    # Detect the face landmarks
    results = FACE_MESH_ENGINE.process(img)

    img.flags.writeable = True

    # Convert back to the BGR color space
    img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    return img, results


# Sample driver code for image input
def input_image(img=None, img_path=None):
    if not img and not img_path:
        return None

    if not img:
        img = cv2.imread(img_path)
    img, landmarks = read_face_mesh(img)
    # cv2.imshow('MediaPipe FaceMesh', img)

    if landmarks.multi_face_landmarks:
        # To improve performance
        for face_landmarks in landmarks.multi_face_landmarks:
            #   Showing the landmark coordinates
            # for id,lm in enumerate(face_landmarks.landmark):
            #     ih, iw, ic = image.shape
            #     x,y = int(lm.x*iw), int(lm.y*ih)
            #     # Prints the x, y coordinates
            #     print(id, x,y)
            MP_DRAWING.draw_landmarks(
                image=img,
                landmark_list=face_landmarks,
                connections=MP_FACE_MESH.FACEMESH_TESSELATION,
                landmark_drawing_spec=None,
                connection_drawing_spec=MP_DRAWING_STYLE.get_default_face_mesh_tesselation_style())
            # Display the image

    cv2.imshow('MediaPipe FaceMesh', img)
    cv2.waitKey(0)
    return img


# Sample driver code for live streaming
def input_videostream():
    cap = cv2.VideoCapture(0)
    while True:
        success, img = cap.read()
        img, landmarks = read_face_mesh(img)
        if landmarks.multi_face_landmarks:
            # To improve performance
            for face_landmarks in landmarks.multi_face_landmarks:
                #   Showing the landmark coordinates
                # for id,lm in enumerate(face_landmarks.landmark):
                #     ih, iw, ic = image.shape
                #     x,y = int(lm.x*iw), int(lm.y*ih)
                #     # Prints the x, y coordinates
                #     print(id, x,y)
                MP_DRAWING.draw_landmarks(
                    image=img,
                    landmark_list=face_landmarks,
                    connections=MP_FACE_MESH.FACEMESH_TESSELATION,
                    landmark_drawing_spec=None,
                    connection_drawing_spec=MP_DRAWING_STYLE.get_default_face_mesh_tesselation_style())
                # Display the image
                cv2.imshow('MediaPipe FaceMesh', img)
                if cv2.waitKey(5) & 0xFF == 27:
                    break
    cap.release()


if __name__ == '__main__':
    img = input_image(img_path='./images/test2.jpeg')
    # input_videostream()

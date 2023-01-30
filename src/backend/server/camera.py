import threading
import binascii
import sys
from time import sleep, time
from utils.utils import base64_to_cv2_image, cv2_image_to_base64
from collections import deque


class Camera(object):
    def __init__(self, makeup_artist):
        self.to_process = deque([])
        self.to_output = deque([])
        self.makeup_artist = makeup_artist

        thread = threading.Thread(target=self.keep_processing, args=())
        thread.daemon = True
        thread.start()

    def process_one(self):
        if not self.to_process:
            return

        time_start = time()
        # input is an ascii string.
        input_str = self.to_process.popleft()

        # convert it to a pil image
        input_img = base64_to_cv2_image(input_str)

        ################## where the hard work is done ############
        # output_img is an PIL image
        # output_img = self.makeup_artist.apply_makeup(input_img)
        output_img = self.makeup_artist.apply_hair_color(input_img, "darkred1")

        # output_str is a base64 string in ascii
        output_str = cv2_image_to_base64(output_img)


        # convert eh base64 string in ascii to base64 string in _bytes_
        self.to_output.append(binascii.a2b_base64(output_str))
        print("Lapsed time: {}, to_process: {}, to_output: {}".format(time() - time_start, len(self.to_process), len(self.to_output)))

    def keep_processing(self):
        while True:
            self.process_one()
            sleep(0)

    def enqueue_input(self, input):
        self.to_process.append(input)

    def get_frame(self):
        while not self.to_output:
            sleep(0.01)
        return self.to_output.popleft()

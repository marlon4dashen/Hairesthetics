import threading
import binascii
import sys
from time import sleep, time
from utils.utils import base64_to_cv2_image, cv2_image_to_base64, bytes_to_cv2_image
from collections import deque


class Worker(object):
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
        input_str, color = self.to_process.popleft()

        # convert it to a cv2 image
        input_img = base64_to_cv2_image(input_str)

        # output_img = self.makeup_artist.apply_makeup(input_img)
        output_img = self.makeup_artist.apply_hair_color(input_img, color)

        # output_str is a base64 string in ascii
        output_str = cv2_image_to_base64(output_img)

        # convert the base64 string in ascii to base64 string in _bytes_
        self.to_output.append(binascii.a2b_base64(output_str))
        # print("Lapsed time: {}, to_process: {}, to_output: {}".format(
        #     time() - time_start, len(self.to_process), len(self.to_output)))

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

    def clean_up(self):
        self.to_process.clear()
        self.to_output.clear()


class ImageWorker:
    
    def __init__(self, makeup_artist):
        self.makeup_artist = makeup_artist
    
    def process_one(self, input_image, color):
        input_image = bytes_to_cv2_image(input_image)
        output_img = self.makeup_artist.apply_hair_color(input_image, color)
        output_str = cv2_image_to_base64(output_img)
        return output_str
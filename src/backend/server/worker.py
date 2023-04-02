import threading
import binascii
import sys
from time import sleep, time
from utils.utils import base64_to_cv2_image, cv2_image_to_base64, bytes_to_cv2_image
from collections import deque


class Worker(object):
    def __init__(self, makeup_artist):
        """
        Initialize a Worker object with the specified makeup_artist.

        Args:
            makeup_artist (obj): An instance of a makeup_artist class responsible for applying the effects.
        """
        self.to_process = deque([]) # A deque for storing input frames to be processed
        self.to_output = deque([]) # A deque for storing processed output frames
        self.makeup_artist = makeup_artist # The makeup_artist instance responsible for applying effects

        # Start a daemon thread to continuously process frames
        thread = threading.Thread(target=self.keep_processing, args=())
        thread.daemon = True
        thread.start()

    def process_one(self):
        """
        Process a single frame from the input deque and store the result in the output deque.
        """
        if not self.to_process:
            return

        time_start = time()
        # # Dequeue an input frame and its color from the input deque (input is an ascii string)
        input_str, color = self.to_process.popleft()

        # Convert the input base64 string to a cv2 image
        input_img = base64_to_cv2_image(input_str)

        # Apply the specified hair color to the input image
        output_img = self.makeup_artist.apply_hair_color(input_img, color)

        # Convert the output cv2 image to a base64 string
        output_str = cv2_image_to_base64(output_img)

        # Convert the base64 string from ASCII to bytes and append it to the output deque
        self.to_output.append(binascii.a2b_base64(output_str))
        

    def keep_processing(self):
        """
        Continuously process input frames in a separate thread.
        """
        while True:
            self.process_one()
            sleep(0)

    def enqueue_input(self, input):
        """
        Enqueue an input frame and its color into the input deque.

        Args:
            input (tuple): A tuple containing the input frame in base64 format and the color to apply.
        """
        self.to_process.append(input)

    def get_frame(self):
        """
        Get the next processed output frame from the output deque.

        Returns:
            bytes: The processed output frame in byte format.
        """
        while not self.to_output:
            sleep(0.01)
        return self.to_output.popleft()

    def clean_up(self):
        """
        Clear both input and output deques.
        """
        self.to_process.clear()
        self.to_output.clear()


class ImageWorker:
    
    def __init__(self, makeup_artist):
        """
        Initialize an ImageWorker object with the specified makeup_artist.

        Args:
            makeup_artist (obj): An instance of a makeup_artist class responsible for applying the effects.
        """
        self.makeup_artist = makeup_artist
    
    def process_one(self, input_image, color):
        """
        Process a single input image and apply the specified hair color.

        Args:
            input_image (bytes): The input image in bytes format.
            color (tuple): A tuple containing the RGB values of the hair color to apply.

        Returns:
            str: The processed output image in base64 string format.
        """
        # Convert the input image in bytes format to a cv2 image
        input_image = bytes_to_cv2_image(input_image)

        # Apply the specified hair color to the input image
        output_img = self.makeup_artist.apply_hair_color(input_image, color)
        
        # Convert the output cv2 image to a base64 string
        output_str = cv2_image_to_base64(output_img)
        
        return output_str
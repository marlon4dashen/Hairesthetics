import onnxruntime
import logging
import os


logger = logging.getLogger(__name__)

class Model:
    def __init__(self, location):
        self.model_location = location
        self.initialize_hair_segmentation_model()


    def initialize_hair_segmentation_model(self):
        # Initialize Model and start inference session
        # Inference session is used to load and run an ONNX model as well to specify
        # environment and configuration options.
        print(os.getcwd())
        self.session = onnxruntime.InferenceSession(self.model_location)

        # The ONNX session consumes and produces data
        # Query the model metadata
        # Get the definition of the inputs metadata
        self.input_name, self.input_type, self.input_shape = self.session.get_inputs()[0].name, \
            self.session.get_inputs()[0].type, \
            self.session.get_inputs()[0].shape
        self.input_height, self.input_width = self.input_shape[2], self.input_shape[3]

        logger.info(f'Input Details: Name={self.input_name} -- Type={self.input_type} '
            f'-- Shape={self.input_shape} -- Height={self.input_height} -- Width={self.input_width}')

        # Get the definition of the outputs metadata
        self.output_name, self.output_type, self.output_shape = self.session.get_outputs()[0].name, \
            self.session.get_outputs()[0].type, \
            self.session.get_outputs()[0].shape

        self.output_height, self.output_width = self.output_shape[2], self.output_shape[3]
        logger.info(f'Output Details: Name={self.output_name} -- Type={self.input_type} '
            f'--Shape={self.output_shape} -- Height={self.output_height} -- Width={self.output_width}')
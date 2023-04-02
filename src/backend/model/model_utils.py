import onnxruntime
import logging
import os


logger = logging.getLogger(__name__)

class Model:
    """
    Model class for loading and running an ONNX model.
    """
    def __init__(self, location):
        """
        Initialize the Model object with the model location.

        Args:
            location (str): Path to the ONNX model file.
        """
        self.model_location = location
        self.initialize_hair_segmentation_model()


    def initialize_hair_segmentation_model(self):
        """
        Initialize the hair segmentation model and start the inference session.
        """
        # Start the ONNX inference session for loading and running the model
        # The session also specifies environment and configuration options
        print(os.getcwd())
        self.session = onnxruntime.InferenceSession(self.model_location)

        # Query the model metadata to get input and output information
        # Get the definition of the input metadata
        self.input_name, self.input_type, self.input_shape = self.session.get_inputs()[0].name, \
            self.session.get_inputs()[0].type, \
            self.session.get_inputs()[0].shape
        self.input_height, self.input_width = self.input_shape[2], self.input_shape[3]

        # Log the input metadata information
        logger.info(f'Input Details: Name={self.input_name} -- Type={self.input_type} '
            f'-- Shape={self.input_shape} -- Height={self.input_height} -- Width={self.input_width}')

        # Get the definition of the output metadata
        self.output_name, self.output_type, self.output_shape = self.session.get_outputs()[0].name, \
            self.session.get_outputs()[0].type, \
            self.session.get_outputs()[0].shape

        self.output_height, self.output_width = self.output_shape[2], self.output_shape[3]
        # Log the output metadata information
        logger.info(f'Output Details: Name={self.output_name} -- Type={self.input_type} '
            f'--Shape={self.output_shape} -- Height={self.output_height} -- Width={self.output_width}')
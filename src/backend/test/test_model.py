from model.model_utils import Model
import pytest

# This test function checks the initialization of the Model class with a valid model file.
# It verifies that the model session and various properties are properly initialized.
def test_model_initialization():
    # Initialize the Model class with a valid ONNX model file.
    model = Model("./model/best_model_simplifier.onnx")

    # Assert that the model session and various properties are properly initialized.
    assert model.session != None
    assert model.input_height != None
    assert model.input_width != None
    assert model.input_name != None
    assert model.input_type != None
    assert model.input_shape != None

# This test function checks the initialization of the Model class with an invalid model file.
# It verifies that an exception is raised when an invalid path is provided.
def test_invalid_path():
    # Use the pytest.raises context manager to check if an exception is raised
    # when initializing the Model class with an invalid ONNX model file.
    with pytest.raises(Exception) as f:
        model = Model("./hair/Model/abc.onnx")

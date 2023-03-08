from model.model_utils import Model
import pytest

def test_model_initialization():
    model = Model("./model/best_model_simplifier.onnx")

    assert model.session != None
    assert model.input_height != None
    assert model.input_width != None
    assert model.input_name != None
    assert model.input_type != None
    assert model.input_shape != None


def test_invalid_path():
    with pytest.raises(Exception) as f:
        model = Model("./hair/Model/abc.onnx")
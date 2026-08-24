# backend/tests/test_embeddings.py
# pyrefly: ignore [missing-import]
import pytest
import os
import sys

# Adjust path to import backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.services.embedding import ONNXEmbeddingModel
from backend.app.core.config import settings

def test_onnx_model_initialization():
    """Verify that the model loads successfully from local files."""
    model = ONNXEmbeddingModel(settings.MODEL_DIR)
    assert model is not None

def test_inference_dimensions():
    """Verify that encoding single and multiple texts yield 384 dimensional vectors."""
    model = ONNXEmbeddingModel(settings.MODEL_DIR)
    
    # Test single
    res_single = model.encode(["Hello World"])
    assert len(res_single) == 1
    assert len(res_single[0]) == 384
    
    # Test multiple (batch)
    res_batch = model.encode(["First document text", "Second document tag electronics"])
    assert len(res_batch) == 2
    assert len(res_batch[0]) == 384
    assert len(res_batch[1]) == 384

def test_empty_input():
    """Verify encoding empty structures cleanly returns empty output list."""
    model = ONNXEmbeddingModel(settings.MODEL_DIR)
    res = model.encode([])
    assert res == []

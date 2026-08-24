# backend/app/api/dependencies.py
from typing import Generator
from backend.app.core.config import settings
from backend.app.core.database import SessionLocal
from backend.app.services.embedding import ONNXEmbeddingModel

# Singleton instance of the ONNX Embedding Model
_embedding_model = None

def get_db() -> Generator:
    """Dependency that yields a database session and closes it afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_embedding_model() -> ONNXEmbeddingModel:
    """Dependency that returns the singleton ONNX model instance."""
    global _embedding_model
    if _embedding_model is None:
        # Load model weights on the first query request
        _embedding_model = ONNXEmbeddingModel(settings.MODEL_DIR)
    return _embedding_model

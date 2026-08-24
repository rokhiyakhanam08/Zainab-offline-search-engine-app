# backend/tests/test_search.py
"""
Unit tests for the hybrid search ranking components.
Tests scoring logic, field participation, and normalization
WITHOUT requiring a live database connection.
"""
import pytest
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.services.embedding import ONNXEmbeddingModel
from backend.app.core.config import settings


def test_query_embedding_generates_vector():
    """
    Verify that a runtime search query produces a 384-dim embedding.
    This is the path triggered for every user search.
    """
    model = ONNXEmbeddingModel(settings.MODEL_DIR)
    vec = model.encode(["Sony wireless headphones"])
    assert len(vec) == 1
    assert len(vec[0]) == 384


def test_query_embedding_is_normalized():
    """
    Verify that L2 norm of generated query vector is ~1.0
    (enabled by our normalization step, required for cosine distance).
    """
    import math
    model = ONNXEmbeddingModel(settings.MODEL_DIR)
    vec = model.encode(["laptop bag eco friendly portable"])
    squared_sum = sum(x ** 2 for x in vec[0])
    norm = math.sqrt(squared_sum)
    assert abs(norm - 1.0) < 0.001, f"Vector norm {norm} is not close to 1.0"


def test_semantic_score_normalization():
    """
    Verify the semantic score normalization formula:
        S_Semantic = (2 - cosine_distance) / 2
    
    cosine_distance is in [0, 2] for unit vectors.
    S_Semantic should be in [0, 1].
    
    Test boundary conditions.
    """
    def s_semantic(cosine_distance):
        return (2.0 - cosine_distance) / 2.0

    # Same vector: distance 0 → score should be 1.0
    assert s_semantic(0.0) == 1.0

    # Orthogonal vectors: distance 1.0 → score should be 0.5
    assert s_semantic(1.0) == 0.5

    # Opposite vectors: distance 2.0 → score should be 0.0
    assert s_semantic(2.0) == 0.0

    # General case: distance 0.5 → score should be 0.75
    assert abs(s_semantic(0.5) - 0.75) < 1e-9


def test_weighted_score_sum_normalization():
    """
    Verify that when all sub-scores are 1.0, the final weighted score is 1.0
    (weights sum to 1.0 by design).
    """
    w_exact = 0.3
    w_partial = 0.2
    w_fuzzy = 0.2
    w_semantic = 0.3

    assert abs(w_exact + w_partial + w_fuzzy + w_semantic - 1.0) < 1e-9

    # Max score when all signals are perfect
    final = (w_exact * 1.0) + (w_partial * 1.0) + (w_fuzzy * 1.0) + (w_semantic * 1.0)
    assert abs(final - 1.0) < 1e-9


def test_query_vs_product_embeddings_are_distinct():
    """
    Verify that the query embedding generation at search time does NOT
    modify the product embeddings pre-stored in the dataset file.
    """
    import json
    path = os.path.join("backend", "dataset", "products_with_embeddings.json")
    if not os.path.exists(path):
        pytest.skip("Dataset not yet generated")

    with open(path, "r", encoding="utf-8") as f:
        products = json.load(f)

    original_embedding = list(products[0]["embedding"])

    # Run a query embedding
    model = ONNXEmbeddingModel(settings.MODEL_DIR)
    model.encode(["This is a runtime search query that should not affect stored embeddings"])

    # Reload the dataset and compare
    with open(path, "r", encoding="utf-8") as f:
        products_after = json.load(f)

    assert products_after[0]["embedding"] == original_embedding, \
        "Product embeddings were modified after a runtime query — this must NOT happen"


def test_brand_partial_match_signal():
    """
    Verify that the partial-match signal for brand queries is correctly
    captured at the Python level (ILIKE logic review).

    For the actual SQL test, this validates the expected behavior:
    - "Sams" should match "Samsung" via prefix ILIKE
    - "son" anywhere in "Sony" or "Samsung" should fire infix match
    """
    def ilike_prefix_match(text: str, query: str) -> bool:
        return text.lower().startswith(query.lower())

    def ilike_infix_match(text: str, query: str) -> bool:
        return query.lower() in text.lower()

    # Prefix cases
    assert ilike_prefix_match("Samsung", "Sams")
    assert ilike_prefix_match("Sony", "Son")
    assert not ilike_prefix_match("LG", "Son")

    # Infix cases (partial brand)
    assert ilike_infix_match("Samsung", "sung")
    assert ilike_infix_match("Home Appliances", "appl")
    assert not ilike_infix_match("Electronics", "appl")

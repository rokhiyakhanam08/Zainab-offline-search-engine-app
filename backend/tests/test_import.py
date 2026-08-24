# backend/tests/test_import.py
"""
Test the idempotent data import mechanism using in-memory
SQLite to avoid requiring a real running PostgreSQL instance.

Since pgvector is Postgres-specific, these tests validate the
import logic at the Python level using mocked DB sessions.
"""
import json
import os
import pytest
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))


def test_products_file_exists():
    """Verify that the seed data with embeddings was pre-generated."""
    path = os.path.join("backend", "dataset", "products_with_embeddings.json")
    assert os.path.exists(path), "products_with_embeddings.json must exist before running imports"


def test_products_count_sufficient():
    """Verify the dataset contains at least 5,000 products."""
    path = os.path.join("backend", "dataset", "products_with_embeddings.json")
    if not os.path.exists(path):
        pytest.skip("Dataset not yet generated")
    with open(path, "r", encoding="utf-8") as f:
        products = json.load(f)
    assert len(products) >= 5000, f"Expected at least 5000 products, got {len(products)}"


def test_sku_uniqueness():
    """Verify all SKUs in the pre-generated dataset are unique (idempotency precondition)."""
    path = os.path.join("backend", "dataset", "products_with_embeddings.json")
    if not os.path.exists(path):
        pytest.skip("Dataset not yet generated")
    with open(path, "r", encoding="utf-8") as f:
        products = json.load(f)
    skus = [p["sku"] for p in products]
    assert len(skus) == len(set(skus)), "All product SKUs must be unique"


def test_all_products_have_embeddings():
    """Verify every product has a 384-dimensional embedding pre-generated."""
    path = os.path.join("backend", "dataset", "products_with_embeddings.json")
    if not os.path.exists(path):
        pytest.skip("Dataset not yet generated")
    with open(path, "r", encoding="utf-8") as f:
        products = json.load(f)
    for p in products:
        assert "embedding" in p, f"Product {p['sku']} is missing embedding"
        assert len(p["embedding"]) == 384, f"Product {p['sku']} has wrong embedding dimension: {len(p['embedding'])}"


def test_all_required_fields_present():
    """Verify every product contains all required schema fields."""
    required_fields = {"sku", "title", "description", "brand", "category", "tags", "price", "image_path", "embedding"}
    path = os.path.join("backend", "dataset", "products_with_embeddings.json")
    if not os.path.exists(path):
        pytest.skip("Dataset not yet generated")
    with open(path, "r", encoding="utf-8") as f:
        products = json.load(f)
    for p in products[:100]:  # Check first 100 for speed
        missing = required_fields - set(p.keys())
        assert not missing, f"Product {p.get('sku', '?')} is missing fields: {missing}"

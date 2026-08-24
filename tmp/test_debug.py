# /tmp/test_debug.py
import sys
import os
import traceback

sys.path.append(os.path.abspath("backend"))

# pyrefly: ignore [missing-import]
from app.services.embedding import ONNXEmbeddingModel
import json

def test():
    model_dir = "backend/model"
    input_path = "backend/dataset/products.json"
    
    with open(input_path, "r", encoding="utf-8") as f:
        products = json.load(f)
        
    model = ONNXEmbeddingModel(model_dir)
    batch = products[:64]
    batch_text = []
    for p in batch:
        tags_str = " ".join(p.get("tags", []))
        repr_text = f"{p['title']} {p['brand']} {p['category']} {tags_str} {p['description']}"
        batch_text.append(repr_text)
        
    print(f"Batch text sample: {batch_text[0][:100]}")
    try:
        model.encode(batch_text)
        print("Success on first batch!")
    except Exception as e:
        traceback.print_exc()

if __name__ == "__main__":
    test()

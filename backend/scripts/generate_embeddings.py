# backend/scripts/generate_embeddings.py
import json
import os
import sys
import time

# Adjust path to enable importing from backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.embedding import ONNXEmbeddingModel

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    model_dir = os.path.join(base_dir, "model")
    dataset_dir = os.path.join(base_dir, "dataset")
    
    input_path = os.path.join(dataset_dir, "products.json")
    output_path = os.path.join(dataset_dir, "products_with_embeddings.json")
    
    if not os.path.exists(input_path):
        print(f"Error: Base products file {input_path} does not exist. Run seed_generator.py first.")
        sys.exit(1)
        
    print("Initializing embedding model...")
    try:
        model = ONNXEmbeddingModel(model_dir)
    except FileNotFoundError as e:
        print(e)
        print("Please run 'python backend/scripts/download_model.py' to download the local model first.")
        sys.exit(1)
        
    with open(input_path, "r", encoding="utf-8") as f:
        products = json.load(f)
        
    print(f"Loaded {len(products)} products. Starting embedding pre-generation...")
    
    # Process in batches to minimize memory overhead
    batch_size = 64
    total = len(products)
    start_time = time.perf_counter()
    
    for i in range(0, total, batch_size):
        batch = products[i:i+batch_size]
        
        # Build document text representation for semantic vectorization
        batch_text = []
        for p in batch:
            tags_str = " ".join(p.get("tags", []))
            repr_text = f"{p['title']} {p['brand']} {p['category']} {tags_str} {p['description']}"
            batch_text.append(repr_text)
            
        try:
            # Generate embeddings
            embeddings = model.encode(batch_text)
            
            for index, emb in enumerate(embeddings):
                batch[index]["embedding"] = emb
                
        except Exception as e:
            print(f"\nError encoding batch starting at index {i}: {e}")
            sys.exit(1)
            
        # Display progress
        sys.stdout.write(f"\rProgress: {min(i + batch_size, total)}/{total} items embedded...")
        sys.stdout.flush()
        
    print("\nEmbedding pre-generation finished.")
    
    # Write enriched dataset
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
        
    duration = time.perf_counter() - start_time
    print(f"Saved dataset with embeddings to: {output_path}")
    print(f"Completed in {duration:.2f} seconds.")

if __name__ == "__main__":
    main()

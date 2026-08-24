# backend/scripts/download_model.py
import os
import urllib.request

MODEL_FILES = {
    "model.onnx": "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/onnx/model.onnx",
    "tokenizer.json": "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer.json",
    "config.json": "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/config.json",
    "special_tokens_map.json": "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/special_tokens_map.json",
    "tokenizer_config.json": "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer_config.json",
    "vocab.txt": "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/vocab.txt"
}

def main():
    dest_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "model"))
    os.makedirs(dest_dir, exist_ok=True)
    print(f"Downloading model files to: {dest_dir}")
    
    for filename, url in MODEL_FILES.items():
        dest_path = os.path.join(dest_dir, filename)
        if os.path.exists(dest_path):
            print(f"File {filename} already exists, skipping.")
            continue
            
        print(f"Downloading {filename} from {url}...")
        try:
            urllib.request.urlretrieve(url, dest_path)
            print(f"Successfully downloaded {filename}")
        except Exception as e:
            print(f"Error downloading {filename}: {e}")
            
    print("Model preparation complete.")

if __name__ == "__main__":
    main()

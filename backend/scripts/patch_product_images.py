"""Update image_path on existing product JSON without regenerating embeddings."""
import json
import os
import re

ITEM_IMAGES = [
    ("headphone", "/images/headphones.svg"),
    ("smartphone", "/images/smartphone.svg"),
    ("smartwatch", "/images/smartwatch.svg"),
    ("speaker", "/images/speaker.svg"),
    ("tablet", "/images/tablet.svg"),
    ("camera", "/images/camera.svg"),
    ("keyboard", "/images/keyboard.svg"),
    ("monitor", "/images/monitor.svg"),
    ("laptop", "/images/laptop.svg"),
]

CATEGORY_IMAGES = {
    "Electronics": "/images/electronics.svg",
    "Home & Kitchen": "/images/home_kitchen.svg",
    "Apparel & Clothing": "/images/apparel.svg",
    "Books & Stationery": "/images/books.svg",
    "Beauty & Personal Care": "/images/beauty.svg",
}


def image_for_product(product):
    text = f"{product.get('title', '')} {' '.join(product.get('tags', []))} {product.get('description', '')}".lower()
    for key, path in ITEM_IMAGES:
        if key in text:
            return path
    if re.search(r"\bphone\b", text):
        return "/images/smartphone.svg"
    return CATEGORY_IMAGES.get(product.get("category"), "/images/placeholder.svg")


def patch_file(path):
    if not os.path.exists(path):
        print(f"Skip missing file: {path}")
        return
    with open(path, "r", encoding="utf-8") as f:
        products = json.load(f)
    changed = 0
    for product in products:
        new_path = image_for_product(product)
        if product.get("image_path") != new_path:
            product["image_path"] = new_path
            changed += 1
    with open(path, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    print(f"Updated {changed} of {len(products)} products in {path}")


def main():
    dataset_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset"))
    patch_file(os.path.join(dataset_dir, "products.json"))
    patch_file(os.path.join(dataset_dir, "products_with_embeddings.json"))


if __name__ == "__main__":
    main()

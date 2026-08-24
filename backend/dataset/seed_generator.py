# backend/dataset/seed_generator.py
import json
import os
import random

CATEGORIES = {
    "Electronics": ["Smartphone", "Laptop", "Wireless Headphone", "Smartwatch", "Bluetooth Speaker", "Monitor", "Keyboard", "Tablet", "Camera"],
    "Home & Kitchen": ["Blender", "Coffee Maker", "Toaster Oven", "Air Fryer", "Vacuum Cleaner", "Electric Kettle", "Juicer", "Microwave", "Slow Cooker"],
    "Apparel & Clothing": ["Running Shoes", "Hoodie", "Athletic T-Shirt", "Jeans", "Winter Jacket", "Sun Hat", "Leather Belt", "Socks Pack", "Backpack"],
    "Books & Stationery": ["Notebook", "Fountain Pen", "Desk Organizer", "Science Fiction Novel", "Programming Guide", "History Book", "Planner", "Sketchbook", "Desk Lamp"],
    "Beauty & Personal Care": ["Moisturizer", "Sunscreen", "Shampoo", "Hair Dryer", "Electric Toothbrush", "Face Wash", "Lip Balm", "Body Lotion", "Shaving Kit"]
}

BRANDS = {
    "Electronics": ["Samsung", "Sony", "Apple", "Dell", "HP", "Lenovo", "Logitech", "Anker", "Bose"],
    "Home & Kitchen": ["Ninja", "Keurig", "KitchenAid", "Breville", "Dyson", "Cuisinart", "Instant Pot", "Hamilton Beach", "Philips"],
    "Apparel & Clothing": ["Nike", "Adidas", "Puma", "Patagonia", "Columbia", "Levi's", "Under Armour", "The North Face", "Carhartt"],
    "Books & Stationery": ["Moleskine", "Parker", "Pilot", "Lamy", "O'Reilly", "Penguin Books", "HarperCollins", "Oxford", "Leuchtturm"],
    "Beauty & Personal Care": ["L'Oreal", "Neutrogena", "CeraVe", "La Roche-Posay", "Nivea", "Dove", "Colgate", "Braun", "Oral-B"]
}

ADJECTIVES = ["Premium", "Essential", "Pro", "Ultra", "Classic", "Smart", "Compact", "Portable", "Eco-Friendly", "Ergonomic"]
COLORS = ["Black", "Silver", "Space Gray", "Midnight Blue", "Forest Green", "Ruby Red", "Gold", "White"]

TAG_MAPPING = {
    "Electronics": ["gadget", "tech", "digital", "smart", "office", "work"],
    "Home & Kitchen": ["kitchen", "cooking", "home", "appliance", "food", "lifestyle"],
    "Apparel & Clothing": ["fashion", "comfort", "outdoor", "active", "wear", "shoes"],
    "Books & Stationery": ["study", "reading", "write", "office", "education", "productivity"],
    "Beauty & Personal Care": ["health", "grooming", "skincare", "daily", "wellness", "hygiene"]
}

def generate_products(count=5100):
    products = []
    generated_skus = set()
    
    category_names = list(CATEGORIES.keys())
    
    for i in range(count):
        category = random.choice(category_names)
        item_types = CATEGORIES[category]
        item_type = random.choice(item_types)
        
        brand_list = BRANDS[category]
        brand = random.choice(brand_list)
        
        adjective = random.choice(ADJECTIVES)
        color = random.choice(COLORS)
        
        # Product model number
        model_num = random.randint(100, 999)
        suffix = random.choice(["X", "Pro", "Max", "Lite", "S", "V2"])
        
        title = f"{brand} {adjective} {color} {item_type} {model_num}{suffix}"
        
        # Unique SKU generation
        cat_prefix = category[:3].upper()
        brand_prefix = brand[:3].upper().replace("'", "").replace(" ", "")
        sku = f"{cat_prefix}-{brand_prefix}-{model_num}{suffix}-{i}"
        
        # Description
        description = (
            f"The {title} is an exceptional product designed for daily use. "
            f"Crafted with durable materials from {brand}, this {item_type.lower()} features "
            f"high-performance parts. Perfect for anyone looking to upgrade their {category.lower()} experience."
        )
        
        price = round(random.uniform(9.99, 1499.99), 2)
        
        # Map item type (and category fallback) to a matching local SVG
        item_images = {
            "Smartphone": "/images/smartphone.svg",
            "Laptop": "/images/laptop.svg",
            "Wireless Headphone": "/images/headphones.svg",
            "Smartwatch": "/images/smartwatch.svg",
            "Bluetooth Speaker": "/images/speaker.svg",
            "Monitor": "/images/monitor.svg",
            "Keyboard": "/images/keyboard.svg",
            "Tablet": "/images/tablet.svg",
            "Camera": "/images/camera.svg",
        }
        category_images = {
            "Electronics": "/images/electronics.svg",
            "Home & Kitchen": "/images/home_kitchen.svg",
            "Apparel & Clothing": "/images/apparel.svg",
            "Books & Stationery": "/images/books.svg",
            "Beauty & Personal Care": "/images/beauty.svg"
        }
        image_path = item_images.get(item_type, category_images.get(category, "/images/placeholder.svg"))
        
        # Generate tags: combine category tags and standard item keywords
        tags = set(TAG_MAPPING[category] + [item_type.lower().replace(" ", ""), adjective.lower(), color.lower()])
        # Select 4-6 random tags
        selected_tags = random.sample(list(tags), k=min(len(tags), random.randint(4, 6)))
        
        products.append({
            "sku": sku,
            "title": title,
            "description": description,
            "brand": brand,
            "category": category,
            "tags": selected_tags,
            "price": price,
            "image_path": image_path
        })
        
    return products

def main():
    dest_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dataset"))
    os.makedirs(dest_dir, exist_ok=True)
    dest_path = os.path.join(dest_dir, "products.json")
    
    print("Generating products...")
    products = generate_products(5200) # generate slightly over 5,000 products
    
    with open(dest_path, "w", encoding="utf-8") as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
        
    print(f"Generated {len(products)} products and saved to {dest_path}")

if __name__ == "__main__":
    main()

# backend/app/api/routes_product.py
import json
import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert

from backend.app.api.dependencies import get_db, get_embedding_model
from backend.app.models.product import Product, Category
from backend.app.schemas.product import ProductResponse, ProductSearchResponse, ImportResponse
from backend.app.services.search import hybrid_search

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/categories")
def get_categories_summary(db: Session = Depends(get_db)):
    """
    Returns list of categories with product counts and representative image paths.
    """
    category_images = {
        "Electronics": "/images/electronics.svg",
        "Home & Kitchen": "/images/home_kitchen.svg",
        "Apparel & Clothing": "/images/apparel.svg",
        "Books & Stationery": "/images/books.svg",
        "Beauty & Personal Care": "/images/beauty.svg"
    }
    
    categories = db.query(Category).all()
    result = []
    for cat in categories:
        count = db.query(Product).filter(Product.category_id == cat.id).count()
        result.append({
            "id": cat.id,
            "name": cat.name,
            "product_count": count,
            "image_path": category_images.get(cat.name, "/images/placeholder.svg")
        })
    return result

@router.get("/featured", response_model=List[ProductResponse])
def get_featured_products(limit: int = Query(8, ge=1, le=24), db: Session = Depends(get_db)):
    """
    Retrieve featured products for homepage display.
    """
    items = db.query(Product).order_by(Product.id.asc()).limit(limit).all()
    results = []
    for item in items:
        category_name = item.category.name if item.category else None
        results.append({
            "id": item.id,
            "sku": item.sku,
            "title": item.title,
            "description": item.description,
            "brand": item.brand,
            "category": category_name,
            "tags": item.tags,
            "price": item.price,
            "image_path": item.image_path,
            "created_at": item.created_at
        })
    return results

@router.get("/search", response_model=List[ProductSearchResponse])
def search_products(
    q: str = Query(..., description="Query string"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    category: Optional[str] = Query(None, description="Filter by category name"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    sort_by: Optional[str] = Query("relevance", description="Sort order: relevance, price_asc, price_desc, title_asc"),
    limit: int = Query(24, ge=1, le=100, description="Limit results"),
    db: Session = Depends(get_db),
    model = Depends(get_embedding_model)
):
    """
    Search products using a hybrid algorithm combining exact query, partial matches,
    trigram similarity, and semantic keyword vectors.
    """
    if not q.strip():
        return []
        
    # Generate query embedding at runtime using the local ONNX model singleton
    query_vector = model.encode([q])[0]
    
    # Query database and return sorted results
    hits = hybrid_search(
        db=db,
        query_text=q.strip(),
        query_vector=query_vector,
        brand_filter=brand,
        category_filter=category,
        min_price=min_price,
        max_price=max_price,
        sort_by=sort_by,
        limit=limit
    )
    
    results = []
    for product, category_name, score in hits:
        results.append({
            "id": product.id,
            "sku": product.sku,
            "title": product.title,
            "description": product.description,
            "brand": product.brand,
            "category": category_name,
            "tags": product.tags,
            "price": product.price,
            "image_path": product.image_path,
            "created_at": product.created_at,
            "score": score
        })
        
    return results

@router.get("/{id}", response_model=ProductResponse)
def get_product(id: int, db: Session = Depends(get_db)):
    """
    Retrieve details for a single product by database ID.
    """
    item = db.query(Product).filter(Product.id == id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {id} not found"
        )
        
    category_name = None
    if item.category_id:
        cat = db.query(Category).filter(Category.id == item.category_id).first()
        category_name = cat.name if cat else None
        
    return {
        "id": item.id,
        "sku": item.sku,
        "title": item.title,
        "description": item.description,
        "brand": item.brand,
        "category": category_name,
        "tags": item.tags,
        "price": item.price,
        "image_path": item.image_path,
        "created_at": item.created_at
    }

@router.post("/import", response_model=ImportResponse)
def import_products_seed(db: Session = Depends(get_db)):
    """
    Import/seed database using pre-generated product dataset products_with_embeddings.json.
    Operates using PostgreSQL UPSERT (INSERT ... ON CONFLICT DO UPDATE) for idempotency.
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    seed_path = os.path.join(base_dir, "dataset", "products_with_embeddings.json")
    
    if not os.path.exists(seed_path):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Seeding file products_with_embeddings.json not found. Run pre-generation first."
        )
        
    try:
        with open(seed_path, "r", encoding="utf-8") as f:
            products_data = json.load(f)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Fatal exception reading seed file: {e}"
        )
        
    # Read unique categories and persist them to categories table
    all_categories = sorted(list(set(p["category"] for p in products_data if p.get("category"))))
    
    category_map = {}
    for cat_name in all_categories:
        # Upsert category
        # Using a simple SELECT or INSERT pattern
        cat_db = db.query(Category).filter(Category.name == cat_name).first()
        if not cat_db:
            cat_db = Category(name=cat_name)
            db.add(cat_db)
            db.commit()
            db.refresh(cat_db)
        category_map[cat_name] = cat_db.id

    processed = 0
    inserted = 0
    updated = 0
    
    # Process products using PostgreSQL native UPSERT in batches
    batch_size = 100
    for i in range(0, len(products_data), batch_size):
        batch = products_data[i:i+batch_size]
        for p in batch:
            cat_id = category_map.get(p.get("category"))
            
            # Map values to insert statement
            stmt = insert(Product).values(
                sku=p["sku"],
                title=p["title"],
                description=p["description"],
                brand=p["brand"],
                category_id=cat_id,
                tags=p.get("tags", []),
                price=p["price"],
                image_path=p.get("image_path"),
                embedding=p.get("embedding")
            )
            
            # On conflict: update contents ensuring idempotency
            stmt = stmt.on_conflict_do_update(
                index_elements=["sku"],
                set_={
                    "title": stmt.excluded.title,
                    "description": stmt.excluded.description,
                    "brand": stmt.excluded.brand,
                    "category_id": stmt.excluded.category_id,
                    "tags": stmt.excluded.tags,
                    "price": stmt.excluded.price,
                    "image_path": stmt.excluded.image_path,
                    "embedding": stmt.excluded.embedding
                }
            )
            
            result = db.execute(stmt)
            
            processed += 1
            # SQLAlchemy result.rowcount can be monitored to track modified rows,
            # though PostgreSQL return counts can vary with UPSERT (1 for insert, 2 for update)
            if result.rowcount == 1:
                inserted += 1
            else:
                updated += 1
                
        db.commit()
        
    return {
        "status": "success",
        "records_processed": processed,
        "records_inserted": inserted,
        "records_updated": updated
    }

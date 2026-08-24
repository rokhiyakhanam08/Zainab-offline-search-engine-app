# backend/app/services/search.py
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional, Tuple
from decimal import Decimal
from datetime import datetime

from backend.app.models.product import Product

def hybrid_search(
    db: Session,
    query_text: str,
    query_vector: List[float],
    brand_filter: Optional[str] = None,
    category_filter: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = "relevance",
    limit: int = 20,
    w_exact: float = 0.3,
    w_partial: float = 0.2,
    w_fuzzy: float = 0.2,
    w_semantic: float = 0.3
) -> List[Tuple[Product, str, float]]:
    """
    Executes a unified PostgreSQL Query matching Exact, Partial, Fuzzy, and Semantic metrics,
    combining them into a single score [0.0 - 1.0].
    
    Returns a list of tuples containing (Product, CategoryName, Score).
    """
    # Build wildcards for prefix and infix patterns
    # Exact prefix matches (e.g., starts with 'lap' or contains ' lap')
    query_start = f"{query_text}%"
    query_space_start = f"% {query_text}%"
    
    # Infix contains check (e.g., contains 'lap' anywhere)
    query_infix = f"%{query_text}%"
    
    # Base SQL statement
    sql = """
    WITH scored_products AS (
        SELECT 
            p.id,
            p.sku,
            p.title,
            p.description,
            p.brand,
            p.category_id,
            p.tags,
            p.price,
            p.image_path,
            p.created_at,
            c.name as category_name,
            
            -- 1. Exact Match Score (1.0 or 0.0)
            CASE 
                WHEN LOWER(p.title) = LOWER(:query_text) OR LOWER(p.brand) = LOWER(:query_text) OR LOWER(p.sku) = LOWER(:query_text) THEN 1.0
                ELSE 0.0 
            END as s_exact,
            
            -- 2. Partial / Prefix Match Score
            GREATEST(
                -- Prefix starts word boundary in title, brand or category name
                CASE 
                    WHEN p.title ILIKE :query_start OR p.title ILIKE :query_space_start OR
                         p.brand ILIKE :query_start OR p.brand ILIKE :query_space_start OR
                         c.name ILIKE :query_start OR c.name ILIKE :query_space_start THEN 1.0
                    ELSE 0.0
                END,
                -- Infix contains match (discounted to 0.5)
                CASE 
                    WHEN p.title ILIKE :query_infix OR p.brand ILIKE :query_infix OR 
                         c.name ILIKE :query_infix OR array_to_string(p.tags, ' ') ILIKE :query_infix THEN 0.5
                    ELSE 0.0
                END,
                -- Word-similarity score from trigram index
                word_similarity(:query_text, p.title)
            ) as s_partial,
            
            -- 3. Fuzzy Similarity Score (0.0 to 1.0)
            GREATEST(
                similarity(p.title, :query_text),
                similarity(p.brand, :query_text)
            ) as s_fuzzy,
            
            -- 4. Semantic Similarity (normalized (2 - distance)/2 since pgvector cosine <=> returns [0, 2])
            CASE 
                WHEN p.embedding IS NOT NULL THEN (2.0 - (p.embedding <=> :query_vector)) / 2.0
                ELSE 0.0
            END as s_semantic
            
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 1 = 1
    """
    
    # Inject active filters
    params = {
        "query_text": query_text,
        "query_start": query_start,
        "query_space_start": query_space_start,
        "query_infix": query_infix,
        "query_vector": str(query_vector), # PGVector library expects string representation for array parameters
    }
    
    if brand_filter:
        sql += " AND p.brand ILIKE :brand_filter"
        params["brand_filter"] = brand_filter
        
    if category_filter:
        sql += " AND c.name ILIKE :category_filter"
        params["category_filter"] = category_filter

    if min_price is not None:
        sql += " AND p.price >= :min_price"
        params["min_price"] = min_price

    if max_price is not None:
        sql += " AND p.price <= :max_price"
        params["max_price"] = max_price

    # Determine order by clause
    order_clause = "ORDER BY final_score DESC"
    if sort_by == "price_asc":
        order_clause = "ORDER BY price ASC"
    elif sort_by == "price_desc":
        order_clause = "ORDER BY price DESC"
    elif sort_by == "title_asc":
        order_clause = "ORDER BY title ASC"
        
    # Append scoring summation and order limit
    sql += f"""
    )
    SELECT 
        *,
        ((:w_exact * s_exact) + 
         (:w_partial * s_partial) + 
         (:w_fuzzy * s_fuzzy) + 
         (:w_semantic * s_semantic)) as final_score
    FROM scored_products
    {order_clause}
    LIMIT :limit;
    """
    
    params.update({
        "w_exact": w_exact,
        "w_partial": w_partial,
        "w_fuzzy": w_fuzzy,
        "w_semantic": w_semantic,
        "limit": limit
    })
    
    result = db.execute(text(sql), params)
    
    hits = []
    for row in result:
        # Reconstruct product from row result fields
        product = Product(
            id=row.id,
            sku=row.sku,
            title=row.title,
            description=row.description,
            brand=row.brand,
            category_id=row.category_id,
            tags=row.tags,
            price=Decimal(str(row.price)),
            image_path=row.image_path,
            created_at=row.created_at
        )
        hits.append((product, row.category_name, float(row.final_score)))
        
    return hits

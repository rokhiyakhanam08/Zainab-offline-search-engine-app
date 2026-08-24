# backend/app/schemas/product.py
from pydantic import BaseModel, Field
from typing import List, Optional
from decimal import Decimal
from datetime import datetime

class CategoryBase(BaseModel):
    name: str

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    sku: str = Field(..., max_length=100)
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    brand: str = Field(..., max_length=100)
    price: Decimal
    image_path: Optional[str] = None
    tags: List[str] = Field(default=[])

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    category: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ProductSearchResponse(ProductResponse):
    score: float

class ImportResponse(BaseModel):
    status: str
    records_processed: int
    records_inserted: int
    records_updated: int

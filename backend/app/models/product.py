# backend/app/models/product.py
from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from pgvector.sqlalchemy import Vector

from backend.app.core.database import Base

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True, index=True)
    
    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(100), nullable=False, unique=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    brand = Column(String(100), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    tags = Column(ARRAY(String), nullable=False, default=[])
    price = Column(Numeric(10, 2), nullable=False)
    image_path = Column(String(512), nullable=True)
    embedding = Column(Vector(384), nullable=True)  # Dimension 384 for MiniLM
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    category = relationship("Category", back_populates="products")

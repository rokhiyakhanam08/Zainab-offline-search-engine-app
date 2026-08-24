# backend/app/api/routes_health.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.api.dependencies import get_db, get_embedding_model
from backend.app.models.product import Product

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check(
    db: Session = Depends(get_db),
    model = Depends(get_embedding_model)
):
    """
    Checks liveness and health status of the application components.
    """
    db_ok = False
    prod_count = 0
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
        
        # Get count
        prod_count = db.query(Product).count()
    except Exception as e:
        # DB connection failed
        db_ok = False
        
    model_loaded = (model is not None)
    
    status = "healthy" if (db_ok and model_loaded) else "unhealthy"
    
    return {
        "status": status,
        "database": "connected" if db_ok else "disconnected",
        "model_loaded": model_loaded,
        "product_count": prod_count
    }

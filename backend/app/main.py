from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import engine, Base
from backend.app.api.routes_health import router as health_router
from backend.app.api.routes_product import router as product_router

# Setup DB tables configuration on boot dynamically
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: could not verify or create tables on startup: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Perform model warm-up on startup so first user request runs quickly
    from backend.app.api.dependencies import get_embedding_model
    try:
        print("Warming up embedding model singleton...")
        get_embedding_model()
        print("Embedding model warm-up complete.")
    except Exception as e:
        print(f"Warning: could not pre-load embedding model: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

# Enable CORS for React frontend connectivity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this. For evaluation, open is perfect.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes under /api
app.include_router(health_router, prefix="/api")
app.include_router(product_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Offline Intelligent Product Search API. Visit /docs for documentation."}

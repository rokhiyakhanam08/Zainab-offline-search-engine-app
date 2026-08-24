from sqlalchemy import create_engine
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

# Create engine, configuring simple connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    # Low-overhead settings
    pool_size=10,
    max_overflow=5
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

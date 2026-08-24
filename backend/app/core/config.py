import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Zainab Online Shopping API"
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/postgres"
    MODEL_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "model"))
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()

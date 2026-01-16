from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    JWT_PUBLIC_KEY: str = Field(..., env="JWT_PUBLIC_KEY")
    CELERY_BROKER_URL: str = Field(..., env="CELERY_BROKER_URL")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

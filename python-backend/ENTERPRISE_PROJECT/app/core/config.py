from pydantic_settings import BaseSettings
from pydantic import Field
import os

class Settings(BaseSettings):
    # Database Configuration (Kubernetes-friendly)
    DATABASE_URL: str = Field(
        default="mysql+mysqldb://user:password@localhost:3306/orchestration_db",
        env="DATABASE_URL"
    )
    DATABASE_HOST: str = Field(default="localhost", env="DATABASE_HOST")
    DATABASE_PORT: int = Field(default=3306, env="DATABASE_PORT")
    DATABASE_USER: str = Field(default="user", env="DATABASE_USER")
    DATABASE_PASSWORD: str = Field(default="password", env="DATABASE_PASSWORD")
    DATABASE_NAME: str = Field(default="orchestration_db", env="DATABASE_NAME")
    
    # API Configuration
    API_HOST: str = Field(default="0.0.0.0", env="API_HOST")
    API_PORT: int = Field(default=8000, env="API_PORT")
    API_BASE_URL: str = Field(default="http://localhost:8000", env="API_BASE_URL")
    
    # CORS Configuration (for Spring Boot integration)
    CORS_ORIGINS: list = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8000",
            "http://localhost:8080"
        ],
        env="CORS_ORIGINS"
    )
    CORS_ALLOW_CREDENTIALS: bool = Field(default=True, env="CORS_ALLOW_CREDENTIALS")
    CORS_ALLOW_METHODS: list = Field(
        default=["*"],
        env="CORS_ALLOW_METHODS"
    )
    CORS_ALLOW_HEADERS: list = Field(
        default=["*"],
        env="CORS_ALLOW_HEADERS"
    )
    
    # JWT Configuration
    JWT_PUBLIC_KEY: str = Field(default="", env="JWT_PUBLIC_KEY")
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    JWT_EXPIRATION: int = Field(default=3600, env="JWT_EXPIRATION")
    
    # Celery Configuration
    CELERY_BROKER_URL: str = Field(
        default="redis://localhost:6379/0",
        env="CELERY_BROKER_URL"
    )
    CELERY_RESULT_BACKEND: str = Field(
        default="redis://localhost:6379/1",
        env="CELERY_RESULT_BACKEND"
    )
    CELERY_TASK_TIMEOUT: int = Field(default=3600, env="CELERY_TASK_TIMEOUT")
    
    # Redis Configuration
    REDIS_HOST: str = Field(default="localhost", env="REDIS_HOST")
    REDIS_PORT: int = Field(default=6379, env="REDIS_PORT")
    REDIS_DB: int = Field(default=0, env="REDIS_DB")
    
    # Kubernetes/Environment Configuration
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    DEBUG: bool = Field(default=False, env="DEBUG")
    
    # Service Health Check
    HEALTH_CHECK_INTERVAL: int = Field(default=30, env="HEALTH_CHECK_INTERVAL")
    READINESS_CHECK_TIMEOUT: int = Field(default=5, env="READINESS_CHECK_TIMEOUT")

    class Config:
        env_file = ".env"
        extra = "ignore"
        case_sensitive = False
    
    @property
    def constructed_database_url(self) -> str:
        """Construct DATABASE_URL from individual components if DATABASE_URL is not set"""
        if self.DATABASE_URL and "mysql" in self.DATABASE_URL:
            return self.DATABASE_URL
        return f"mysql+mysqldb://{self.DATABASE_USER}:{self.DATABASE_PASSWORD}@{self.DATABASE_HOST}:{self.DATABASE_PORT}/{self.DATABASE_NAME}"

settings = Settings()

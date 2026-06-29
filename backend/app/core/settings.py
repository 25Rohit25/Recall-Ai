"""
Why it exists: Centralizes all application configuration and environment variables.
Why this architecture is scalable: By using Pydantic BaseSettings, configuration is strictly typed and validated on startup. If an essential environment variable is missing, the application fails immediately rather than failing unpredictably later.
How it can evolve: It easily separates dev, staging, and prod configurations through the 'ENVIRONMENT' variable.
Common mistakes avoided: Hardcoding secrets, reading from os.environ directly throughout the codebase (which breaks type safety and testability).
"""
import os
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "FireNotes AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment Management
    ENVIRONMENT: str = "development" # development, staging, production
    
    # Security
    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION" # Placeholder for future JWT logic
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # CORS
    BACKEND_CORS_ORIGINS: Union[str, List[str]] = ["http://localhost:3000"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        import json
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                # it's a JSON array string
                try:
                    return json.loads(v)
                except Exception:
                    pass
            # comma-separated string fallback
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./firenotes.db"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )

settings = Settings()

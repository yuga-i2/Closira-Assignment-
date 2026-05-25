from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    DATABASE_URL: str = "sqlite:///./closira.db"
    LOG_LEVEL: str = "INFO"
    APP_ENV: str = "development"


@lru_cache()
def get_settings() -> Settings:
    return Settings()

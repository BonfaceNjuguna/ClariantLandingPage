from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    GOOGLE_CLIENT_ID: str
    MS_CLIENT_ID: str
    WHITELISTED_EMAIL: str
    JWT_SECRET: str
    SMTP_USER: str
    SMTP_PASS: str

    model_config = ConfigDict(env_file=".env", extra="ignore")

settings = Settings()

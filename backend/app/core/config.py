from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    GOOGLE_CLIENT_ID: str
    WHITELISTED_EMAIL: str
    JWT_SECRET: str
    SMTP_USER: str
    SMTP_PASS: str

    class Config:
        env_file = ".env"

settings = Settings()

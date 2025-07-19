from sqlalchemy import create_engine
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, future=True)

def connect_db():
    try:
        engine.connect()
        print("✅ Connected to DB")
    except Exception as e:
        print("❌ DB connection failed:", e)

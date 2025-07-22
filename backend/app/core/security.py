import jwt
from datetime import datetime, timedelta, timezone
from app.core.config import settings

def create_jwt_token(email: str):
    token_data = {
        "sub": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=12)
    }
    return jwt.encode(token_data, settings.JWT_SECRET, algorithm="HS256")

def decode_jwt_token(token: str):
    return jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
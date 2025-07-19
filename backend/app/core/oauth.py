import httpx
from fastapi import HTTPException
from app.core.config import settings

GOOGLE_OAUTH_URL = "https://oauth2.googleapis.com/tokeninfo"

async def verify_google_token(id_token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{GOOGLE_OAUTH_URL}?id_token={id_token}")
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google token")

        data = response.json()
        email = data.get("email")
        hd = data.get("hd", "")

        if not email:
            raise HTTPException(status_code=400, detail="Email not found in token")

        if not (email.endswith("@clariant.com") or email == settings.WHITELISTED_EMAIL):
            raise HTTPException(status_code=403, detail="Unauthorized email domain")

        return {"email": email, "name": data.get("name")}

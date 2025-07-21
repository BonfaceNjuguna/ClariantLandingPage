import httpx
from fastapi import HTTPException
from jose import jwt
import json
from app.core.config import settings

# Microsoft OpenID metadata
MS_OIDC_DISCOVERY = "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration"

async def verify_google_token(id_token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}")
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google token")
        data = response.json()
        return validate_email_domain(data)

async def verify_microsoft_token(access_token: str):
    async with httpx.AsyncClient() as client:
        # Get MS OIDC config
        config = await client.get(MS_OIDC_DISCOVERY)
        jwks_uri = config.json()["jwks_uri"]
        issuer = config.json()["issuer"]

        # Get public keys
        jwks_resp = await client.get(jwks_uri)
        keys = jwks_resp.json()["keys"]

    # Decode token header
    unverified_header = jwt.get_unverified_header(access_token)
    key = next((k for k in keys if k["kid"] == unverified_header["kid"]), None)

    if not key:
        raise HTTPException(status_code=401, detail="Unable to find key for Microsoft token")

    # Build public key
    from jose import jwk
    from jose.utils import base64url_decode

    public_key = jwk.construct(key)
    message, encoded_sig = access_token.rsplit(".", 1)
    decoded_sig = base64url_decode(encoded_sig.encode())

    if not public_key.verify(message.encode(), decoded_sig):
        raise HTTPException(status_code=401, detail="Invalid Microsoft token")

    payload = jwt.get_unverified_claims(access_token)

    if payload.get("iss") != issuer:
        raise HTTPException(status_code=401, detail="Invalid issuer")

    return validate_email_domain(payload)

def validate_email_domain(data: dict):
    email = data.get("email")
    name = data.get("name", "")

    if not email:
        raise HTTPException(status_code=400, detail="Email not found in token")

    if not (email.endswith("@clariant.com") or email == settings.WHITELISTED_EMAIL):
        raise HTTPException(status_code=403, detail="Unauthorized email domain")

    return {"email": email, "name": name}

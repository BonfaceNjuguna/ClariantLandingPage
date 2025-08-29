import httpx
from fastapi import HTTPException
from jose import jwt
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
        # Get MS OIDC config to find the jwks_uri
        config_response = await client.get(MS_OIDC_DISCOVERY)
        if config_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Could not retrieve Microsoft OIDC configuration")
        
        config = config_response.json()
        jwks_uri = config["jwks_uri"]

        # Get public keys
        jwks_response = await client.get(jwks_uri)
        if jwks_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Could not retrieve Microsoft JWKS")
            
        jwks = jwks_response.json()

    try:
        unverified_header = jwt.get_unverified_header(access_token)
        kid = unverified_header.get("kid")
        
        key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
        if not key:
            raise HTTPException(status_code=401, detail="Unable to find a matching key for token")

        # Decode the token without issuer validation first
        payload = jwt.decode(
            access_token,
            key,
            algorithms=[unverified_header.get("alg")],
            audience=settings.MS_CLIENT_ID,
            options={"verify_issuer": False} # We'll verify issuer manually
        )

        # Manual issuer validation for multi-tenant apps
        tenant_id = payload.get("tid")
        if not tenant_id:
            raise HTTPException(status_code=401, detail="'tid' claim not found in token")

        expected_issuer = f"https://login.microsoftonline.com/{tenant_id}/v2.0"
        if payload.get("iss") != expected_issuer:
            raise HTTPException(status_code=401, detail=f"Invalid issuer. Expected {expected_issuer}, got {payload.get('iss')}")

        return validate_email_domain(payload)

    except jwt.ExpiredSignatureError as e:
        print(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Microsoft token has expired")
    except jwt.JWTClaimsError as e:
        print(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid claims: {e}")
    except Exception as e:
        print(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail=f"Invalid Microsoft token: {e}")


def validate_email_domain(data: dict):
    email = data.get("email")
    name = data.get("name", "")

    if not email:
        # For Microsoft tokens, the email is often in the 'preferred_username' claim
        email = data.get("preferred_username")

    if not email:
        raise HTTPException(status_code=400, detail="Email not found in token")

    if not (email.endswith("@clariant.com") or email == settings.WHITELISTED_EMAIL):
        raise HTTPException(status_code=403, detail="Unauthorized email domain")

    return {"email": email, "name": name}

from fastapi.testclient import TestClient
from main import app

def test_login_missing_token():
    client = TestClient(app)
    response = client.post("/auth/login", json={})
    assert response.status_code == 422

def test_login_invalid_token(monkeypatch):
    client = TestClient(app)
    from fastapi import HTTPException

    async def mock_verify_microsoft_token(token):
        raise HTTPException(status_code=401, detail="Invalid Microsoft token: Error decoding token headers.")

    monkeypatch.setattr("app.core.oauth.verify_microsoft_token", mock_verify_microsoft_token)

    response = client.post("/auth/login", json={"token": "invalid-token"})
    assert response.status_code == 401
    assert "Invalid Microsoft token" in response.json()["detail"]

def test_login_unauthorized_email(monkeypatch):
    client = TestClient(app)

    # Patch verify_microsoft_token to return unauthorized email
    async def mock_verify_microsoft_token(token):
        return {"email": "unauthorized@example.com", "name": "Test User"}

    monkeypatch.setattr("app.core.oauth.verify_microsoft_token", mock_verify_microsoft_token)

    response = client.post("/auth/login", json={"token": "valid-token"})
    assert response.status_code == 403 or response.status_code == 401

def test_login_success(monkeypatch, client, db_session):
    async def mock_verify_microsoft_token(token):
        return {"email": "test@clariant.com", "name": "Test User"}

    # Patch where the route handler imports it
    monkeypatch.setattr("app.api.routes.auth.verify_microsoft_token", mock_verify_microsoft_token)

    # Override get_db to use the test's db_session
    from app.core.dependencies import get_db
    def override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.post("/auth/login", json={"token": "valid-token"})
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Login successful"
    assert "access_token" in data
    assert data["user"]["email"] == "test@clariant.com"

    app.dependency_overrides.pop(get_db, None)
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.crud.app_entry import create_app_entry
from app.schemas.app_entry import AppCreate
from app.core.dependencies import get_current_user
from app.models.user import User
from main import app

# Mock user for dependency injection
def get_mock_user():
    return User(id=1, email="test@test.com", name="Test User")

app.dependency_overrides[get_current_user] = get_mock_user

def test_list_apps_empty(client: TestClient):
    response = client.get("/apps/")
    assert response.status_code == 200
    assert response.json() == {"items": [], "total": 0}

def test_create_app(client: TestClient, db_session: Session):
    app_data = {
        "name": "Test App",
        "owner": "Test Owner",
        "description": "A test application",
        "url": "http://testapp.com",
        "comment": "No comment",
        "status": "Active"
    }
    response = client.post("/apps/", json=app_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == app_data["name"]
    assert "id" in data

def test_list_apps_with_data(client: TestClient, db_session: Session):
    app_data = AppCreate(
        name="Test App",
        owner="Test Owner",
        description="A test application",
        url="http://testapp.com",
        comment="No comment",
        status="Active"
    )
    create_app_entry(db_session, app_data, user_id=1)

    response = client.get("/apps/")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Test App"

def test_search_apps(client: TestClient, db_session: Session):
    app1_data = AppCreate(
        name="First App",
        owner="Owner A",
        description="Description A",
        status="Active"
    )
    app2_data = AppCreate(
        name="Second App",
        owner="Owner B",
        description="Description B",
        status="Inactive"
    )
    create_app_entry(db_session, app1_data, user_id=1)
    create_app_entry(db_session, app2_data, user_id=1)

    response = client.get("/apps/?search=First")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "First App"

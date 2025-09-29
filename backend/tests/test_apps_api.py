from fastapi.testclient import TestClient
from main import app
from app.models.user import User

# Mock user for authentication
def get_mock_user():
    return User(id=1, email="test@clariant.com", name="Test User")

app.dependency_overrides["app.core.dependencies.get_current_user"] = get_mock_user

def test_create_app_missing_fields(client):
    app_data = {
        "owner": "Test Owner",
        "description": "Missing name and status"
    }
    response = client.post("/apps/", json=app_data)
    assert response.status_code == 422

def test_get_app_by_id_not_found(client):
    response = client.get("/apps/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "App not found"

def test_update_app_not_found(client):
    app_data = {
        "name": "Updated Name",
        "owner": "Owner",
        "description": "Desc",
        "url": "http://updated.com",
        "comment": "Updated",
        "status": "Active"
    }
    response = client.put("/apps/9999", json=app_data)
    assert response.status_code == 404
    assert response.json()["detail"] == "App not found"

def test_delete_app_not_found(client):
    response = client.delete("/apps/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "App not found"

def test_list_apps_status_filter(client, db_session):
    from app.crud.app_entry import create_app_entry
    from app.schemas.app_entry import AppCreate

    app1 = AppCreate(
        name="Active App",
        owner="Owner",
        description="Active",
        url="http://active.com",
        comment="Active comment",
        status="Active"
    )
    app2 = AppCreate(
        name="Inactive App",
        owner="Owner",
        description="Inactive",
        url="http://inactive.com",
        comment="Inactive comment",
        status="Inactive"
    )
    create_app_entry(db_session, app1, user_id=1)
    create_app_entry(db_session, app2, user_id=1)

    response = client.get("/apps/?status=Active")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["name"] == "Active App"

def test_list_apps_sorting(client, db_session):
    from app.crud.app_entry import create_app_entry
    from app.schemas.app_entry import AppCreate

    app1 = AppCreate(
        name="Alpha",
        owner="Owner",
        description="Alpha",
        url="http://alpha.com",
        comment="Alpha comment",
        status="Active"
    )
    app2 = AppCreate(
        name="Beta",
        owner="Owner",
        description="Beta",
        url="http://beta.com",
        comment="Beta comment",
        status="Active"
    )
    create_app_entry(db_session, app1, user_id=1)
    create_app_entry(db_session, app2, user_id=1)

    # Sort by name ascending
    response = client.get("/apps/?sortBy=name&sortOrder=asc")
    assert response.status_code == 200
    items = response.json()["items"]
    assert items[0]["name"] == "Alpha"
    assert items[1]["name"] == "Beta"

    # Sort by name descending
    response = client.get("/apps/?sortBy=name&sortOrder=desc")
    assert response.status_code == 200
    items = response.json()["items"]
    assert items[0]["name"] == "Beta"
    assert items[1]["name"] == "Alpha"
from app.crud.app_entry import create_app_entry, get_app_by_id, update_app, delete_app
from app.crud.user import create_user, update_last_login
from app.schemas.app_entry import AppCreate
from app.models.user import User
from sqlalchemy.orm import Session
from datetime import datetime, timezone

def test_create_user_and_update_last_login(db_session: Session):
    user_data = {"email": "user@clariant.com", "name": "User"}
    user = create_user(db_session, user_data)
    assert user.email == "user@clariant.com"
    assert user.name == "User"
    old_login = user.last_login
    update_last_login(db_session, user)
    db_session.refresh(user)
    assert user.last_login > old_login

def test_create_app_entry_and_get(db_session: Session):
    app_data = AppCreate(
        name="CRUD App",
        owner="Owner",
        description="CRUD test",
        url="http://crud.com",
        comment="CRUD comment",
        status="Active"
    )
    app = create_app_entry(db_session, app_data, user_id=1)
    assert app.name == "CRUD App"
    fetched = get_app_by_id(db_session, app.id)
    assert fetched.id == app.id

def test_update_app(db_session: Session):
    app_data = AppCreate(
        name="To Update",
        owner="Owner",
        description="Before update",
        url="http://before.com",
        comment="Before",
        status="Active"
    )
    app = create_app_entry(db_session, app_data, user_id=1)
    update_data = AppCreate(
        name="Updated",
        owner="New Owner",
        description="After update",
        url="http://after.com",
        comment="After",
        status="Inactive"
    )
    updated = update_app(db_session, app.id, update_data)
    assert updated.name == "Updated"
    assert updated.status == "Inactive"
    assert updated.owner == "New Owner"

def test_delete_app(db_session: Session):
    app_data = AppCreate(
        name="To Delete",
        owner="Owner",
        description="Delete me",
        url="http://delete.com",
        comment="Delete",
        status="Active"
    )
    app = create_app_entry(db_session, app_data, user_id=1)
    result = delete_app(db_session, app.id)
    assert result["detail"] == "App deleted successfully"
    try:
        get_app_by_id(db_session, app.id)
        assert False, "App should be deleted"
    except Exception as e:
        assert "App not found" in str(e)
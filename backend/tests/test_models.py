import pytest
from pydantic import ValidationError
from app.schemas.app_entry import AppOut, AppCreate
from app.schemas.auth import SendOtpPayload, VerifyOtpPayload

def test_app_create_valid():
    app = AppCreate(
        name="Test App",
        owner="Owner",
        description="Description",
        url="http://test.com",
        comment="Comment",
        status="Active"
    )
    assert app.name == "Test App"
    assert app.status == "Active"

def test_app_create_invalid_status():
    with pytest.raises(ValueError):
        AppCreate(
            name="Test App",
            owner="Owner",
            description="Description",
            url="http://test.com",
            comment="Comment",
            status="Unknown"
        )

def test_app_out_from_attributes():
    attrs = {
        "id": 1,
        "name": "Test App",
        "owner": "Owner",
        "description": "Description",
        "url": "http://test.com",
        "comment": "Comment",
        "status": "Inactive"
    }
    app = AppOut.model_validate(attrs)
    assert app.id == 1
    assert app.status == "Inactive"

def test_send_otp_payload_valid():
    payload = SendOtpPayload(email="user@clariant.com")
    assert payload.email == "user@clariant.com"

def test_send_otp_payload_invalid_email():
    with pytest.raises(ValueError):
        SendOtpPayload(email="not-an-email")

def test_verify_otp_payload_valid():
    payload = VerifyOtpPayload(email="user@clariant.com", otp="123456")
    assert payload.otp == "123456"

def test_verify_otp_payload_missing_otp():
    with pytest.raises(ValidationError):
        VerifyOtpPayload(email="user@clariant.com")
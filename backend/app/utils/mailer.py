from email.message import EmailMessage
import smtplib
from app.core.config import settings

def send_email(to_email: str, otp: str):
    smtp_host = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = settings.SMTP_USER
    smtp_pass = settings.SMTP_PASS

    msg = EmailMessage()
    msg["Subject"] = "Your Clariant Apps Landing Page OTP Code"
    msg["From"] = smtp_user
    msg["To"] = to_email
    msg.set_content(f"Your OTP code is: {otp}")

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
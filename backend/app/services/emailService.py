import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings


class EmailService:
    """Service for sending emails via SMTP"""
    
    @staticmethod
    async def send_email(to_email: str, subject: str, body: str, is_html: bool = True):
        """
        Send an email via SMTP
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            body: Email body (HTML or plain text)
            is_html: Whether body is HTML (default: True)
        """
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
            message["To"] = to_email
            message["Subject"] = subject
            
            # Attach body
            mime_type = "html" if is_html else "plain"
            message.attach(MIMEText(body, mime_type))
            
            # Send via SMTP
            await aiosmtplib.send(
                message,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USER,
                password=settings.SMTP_PASSWORD,
                start_tls=True
            )
            
            print(f"✅ Email sent to {to_email}: {subject}")
            return True
            
        except Exception as e:
            print(f"❌ Email sending failed to {to_email}: {str(e)}")
            return False
    
    @staticmethod
    async def send_welcome_email(email: str, name: str, user_type: str):
        """
        Send welcome email after registration
        """
        subject = "Welcome to DZ-Stagia!"
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Welcome to DZ-Stagia! 🎉</h2>
                <p>Dear {name},</p>
                <p>Thank you for registering as a {user_type} on DZ-Stagia.</p>
                <p>Your account is currently pending approval from our admin team. You'll receive another email once your account is approved.</p>
                <p><strong>What happens next?</strong></p>
                <ul style="line-height: 1.8;">
                    <li>Our team will review your registration</li>
                    <li>You'll receive an approval notification via email</li>
                    <li>Once approved, you can log in and access the platform</li>
                </ul>
                <p>This usually takes 24-48 hours.</p>
                <hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px;">DZ-Stagia Team</p>
            </body>
        </html>
        """
        
        return await EmailService.send_email(email, subject, body)
    
    @staticmethod
    async def send_otp_email(email: str, otp: str, purpose: str = "verification"):
        """
        Send OTP code via email
        
        Args:
            email: Recipient email
            otp: 6-digit OTP code
            purpose: "verification" or "password_reset"
        """
        if purpose == "verification":
            subject = "Verify Your Email - DZ-Stagia"
            body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">Email Verification</h2>
                    <p>Thank you for registering with DZ-Stagia!</p>
                    <p>Your verification code is:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <h1 style="color: #1f2937; letter-spacing: 8px; margin: 0;">{otp}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px;">DZ-Stagia Team</p>
                </body>
            </html>
            """
        else:  # password_reset
            subject = "Password Reset - DZ-Stagia"
            body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #dc2626;">Password Reset Request</h2>
                    <p>We received a request to reset your password.</p>
                    <p>Your password reset code is:</p>
                    <div style="background-color: #fef2f2; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <h1 style="color: #991b1b; letter-spacing: 8px; margin: 0;">{otp}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p><strong>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</strong></p>
                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px;">DZ-Stagia Team</p>
                </body>
            </html>
            """
        
        return await EmailService.send_email(email, subject, body)
    
    @staticmethod
    async def send_approval_email(email: str, user_type: str, approved: bool, name: str):
        """
        Send account approval/rejection notification
        
        Args:
            email: User email
            user_type: "student" or "company"
            approved: True if approved, False if rejected
            name: User's name
        """
        if approved:
            subject = "Account Approved - DZ-Stagia"
            body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #059669;">🎉 Account Approved!</h2>
                    <p>Dear {name},</p>
                    <p>Great news! Your {user_type} account has been approved by our admin team.</p>
                    <p>You can now log in and start using DZ-Stagia platform.</p>
                    <div style="margin: 30px 0;">
                        <a href="https://dzstagia.com/login" 
                           style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                            Login Now
                        </a>
                    </div>
                    <p>If you have any questions, feel free to contact our support team.</p>
                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px;">DZ-Stagia Team</p>
                </body>
            </html>
            """
        else:
            subject = "Account Status Update - DZ-Stagia"
            body = f"""
            <html>
                <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #dc2626;">Account Application Status</h2>
                    <p>Dear {name},</p>
                    <p>Thank you for your interest in DZ-Stagia.</p>
                    <p>After reviewing your application, we regret to inform you that we cannot approve your {user_type} account at this time.</p>
                    <p>If you believe this was a mistake or have questions, please contact our support team.</p>
                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="color: #6b7280; font-size: 12px;">DZ-Stagia Team</p>
                </body>
            </html>
            """
        
        return await EmailService.send_email(email, subject, body)
    
    
import os
import asyncio
import logging
import resend

logger = logging.getLogger(__name__)


async def send_notification(subject: str, html: str):
    api_key = os.environ.get("RESEND_API_KEY")
    notify_to = os.environ.get("NOTIFY_EMAIL")
    if not api_key or not notify_to:
        logger.warning("Email notification skipped: RESEND_API_KEY or NOTIFY_EMAIL not set")
        return
    resend.api_key = api_key
    params = {
        "from": f"AASW Website <{os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')}>",
        "to": [notify_to],
        "subject": subject,
        "html": html,
    }
    try:
        result = await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Notification email sent: {result.get('id')}")
    except Exception as e:
        logger.error(f"Failed to send notification email: {e}")


def contact_email_html(data: dict) -> str:
    return f"""
    <table style="width:100%;max-width:600px;font-family:Arial,sans-serif;border-collapse:collapse">
      <tr><td style="background:#064e3b;color:#fff;padding:16px 24px;font-size:18px;font-weight:bold">New Contact Message — AASW Website</td></tr>
      <tr><td style="padding:24px;border:1px solid #e5e7eb">
        <p><strong>Name:</strong> {data.get('name')}</p>
        <p><strong>Email:</strong> {data.get('email')}</p>
        <p><strong>Phone:</strong> {data.get('phone') or '—'}</p>
        <p><strong>Subject:</strong> {data.get('subject')}</p>
        <p style="margin-top:16px;padding:16px;background:#f0fdf4;border-left:4px solid #064e3b">{data.get('message')}</p>
      </td></tr>
    </table>
    """


def volunteer_email_html(data: dict) -> str:
    interests = ", ".join(data.get("areas_of_interest") or []) or "—"
    return f"""
    <table style="width:100%;max-width:600px;font-family:Arial,sans-serif;border-collapse:collapse">
      <tr><td style="background:#064e3b;color:#fff;padding:16px 24px;font-size:18px;font-weight:bold">New Volunteer Application — AASW Website</td></tr>
      <tr><td style="padding:24px;border:1px solid #e5e7eb">
        <p><strong>Name:</strong> {data.get('name')}</p>
        <p><strong>Email:</strong> {data.get('email')}</p>
        <p><strong>Phone:</strong> {data.get('phone')}</p>
        <p><strong>Profession:</strong> {data.get('profession') or '—'}</p>
        <p><strong>Areas of Interest:</strong> {interests}</p>
        <p><strong>Availability:</strong> {data.get('availability') or '—'}</p>
        <p style="margin-top:16px;padding:16px;background:#f0fdf4;border-left:4px solid #064e3b">{data.get('message') or 'No message'}</p>
      </td></tr>
    </table>
    """

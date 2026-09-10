from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend


class ResendEmailBackend(BaseEmailBackend):
    """
    Sends email via Resend's HTTPS API instead of raw SMTP. Necessary
    because Render blocks all outbound SMTP ports (25, 465, 587) on free
    web services - Resend's API goes over plain HTTPS (port 443), which
    is never blocked, so this works reliably on Render's free tier.
    """

    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        import resend
        resend.api_key = settings.RESEND_API_KEY

        sent_count = 0
        for message in email_messages:
            try:
                resend.Emails.send({
                    "from": message.from_email,
                    "to": message.to,
                    "subject": message.subject,
                    "text": message.body,
                })
                sent_count += 1
            except Exception as exc:
                print(f"[ResendEmailBackend] Failed to send to {message.to}: {exc}")
                if not self.fail_silently:
                    raise
        return sent_count
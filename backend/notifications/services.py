from .models import Notification


def create_notification(*, recipient, notification_type, message, application=None):
    """Create a notification for a user from any marketplace workflow."""
    return Notification.objects.create(
        recipient=recipient,
        application=application,
        notification_type=notification_type,
        message=message,
    )

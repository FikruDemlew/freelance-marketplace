from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    application_id = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = Notification
        fields = [
            "id",
            "application_id",
            "notification_type",
            "message",
            "is_read",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "application_id",
            "notification_type",
            "message",
            "created_at",
        ]

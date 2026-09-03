from rest_framework import serializers

from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):

    sender_username = serializers.ReadOnlyField(
        source="sender.username"
    )

    class Meta:
        model = Message

        fields = [
            "id",
            "conversation",
            "sender",
            "sender_username",
            "content",
            "is_read",
            "created_at",
        ]

        read_only_fields = [
    "id",
    "conversation",
    "sender",
    "sender_username",
    "is_read",
    "created_at",
]

class ConversationSerializer(serializers.ModelSerializer):

    client_username = serializers.ReadOnlyField(
        source="client.username"
    )

    freelancer_username = serializers.ReadOnlyField(
        source="freelancer.username"
    )

    class Meta:
        model = Conversation

        fields = [
            "id",
            "application",
            "client",
            "client_username",
            "freelancer",
            "freelancer_username",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "client",
            "client_username",
            "freelancer",
            "freelancer_username",
            "created_at",
            "updated_at",
        ]
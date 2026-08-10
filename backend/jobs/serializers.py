from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):

    client = serializers.ReadOnlyField(
        source="client.username"
    )

    class Meta:
        model = Job

        fields = [
            "id",
            "client",
            "title",
            "description",
            "category",
            "budget",
            "deadline",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "client",
            "created_at",
        ]
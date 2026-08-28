from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):

    client = serializers.ReadOnlyField(
        source="client.username"
    )

    applications_count = serializers.IntegerField(
        source="applications.count",
        read_only=True,
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
            "applications_count",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "client",
            "created_at",
        ]

    def validate(self, attrs):
        status = attrs.get("status")

        if (
            status == "Completed"
            and self.instance
            and self.instance.status != "In Progress"
        ):
            raise serializers.ValidationError(
                {
                    "status": (
                        "Only an In Progress job can be marked Completed."
                    )
                }
            )

        return attrs
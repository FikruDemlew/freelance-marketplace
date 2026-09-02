from rest_framework import serializers
from .models import Job, SavedJob


class JobSerializer(serializers.ModelSerializer):

    client = serializers.ReadOnlyField(
        source="client.username"
    )

    client_id = serializers.ReadOnlyField(source="client.id")

    applications_count = serializers.IntegerField(
        source="applications.count",
        read_only=True,
    )

    class Meta:
        model = Job

        fields = [
            "id",
            "client",
            "client_id",
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

        if status and self.instance and status != self.instance.status:
            valid_transitions = {
                "Open": {"In Progress", "Closed"},
                "In Progress": {"Completed"},
            }
            if status not in valid_transitions.get(self.instance.status, set()):
                raise serializers.ValidationError(
                    {"status": "Invalid job status transition."}
                )

            if status == "In Progress" and not self.instance.applications.filter(
                status="Accepted"
            ).exists():
                raise serializers.ValidationError(
                    {"status": "A job requires an accepted application to start."}
                )

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


class SavedJobSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    user_id = serializers.ReadOnlyField(source="user.id")
    job = JobSerializer(read_only=True)
    job_id = serializers.ReadOnlyField(source="job.id")

    class Meta:
        model = SavedJob
        fields = [
            "id",
            "user",
            "user_id",
            "job",
            "job_id",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "user",
            "user_id",
            "job",
            "job_id",
            "created_at",
        ]

from rest_framework import serializers

from .models import Application
from jobs.models import Job


class ApplicationSerializer(serializers.ModelSerializer):

    job = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all())

    freelancer = serializers.ReadOnlyField(
        source="freelancer.username"
    )

    freelancer_id = serializers.ReadOnlyField(
        source="freelancer.id"
    )

    job_title = serializers.ReadOnlyField(
        source="job.title"
    )

    class Meta:
        model = Application

        fields = [
            "id",
            "job",
            "job_title",
            "freelancer",
            "freelancer_id",
            "proposal",
            "bid_amount",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "freelancer",
            "freelancer_id",
            "job_title",
            "created_at",
        ]

    def validate(self, attrs):

        request = self.context.get("request")
        job = attrs.get("job")
        status = attrs.get("status")

        if self.instance and "job" in attrs:
            raise serializers.ValidationError(
                {"job": "An application cannot be moved to another job."}
            )

        if not self.instance and job.status != "Open":
            raise serializers.ValidationError(
                {"job": "Applications can only be submitted for open jobs."}
            )

        if status and request and request.user.is_authenticated:
            is_client = (
                self.instance
                and self.instance.job.client_id == request.user.id
            )
            if not is_client:
                raise serializers.ValidationError(
                    {"status": "Only the job owner can change application status."}
                )

            if self.instance.status != "Pending" and status != self.instance.status:
                raise serializers.ValidationError(
                    {"status": "Only pending applications can change status."}
                )

        if request and request.user.is_authenticated:

            already_applied = Application.objects.filter(
                job=job,
                freelancer=request.user
            ).exclude(
                pk=self.instance.pk if self.instance else None
            ).exists()

            if already_applied:
                raise serializers.ValidationError(
                    {
                        "job": "You have already applied to this job."
                    }
                )

        return attrs
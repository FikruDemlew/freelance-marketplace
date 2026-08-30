from rest_framework import serializers

from applications.models import Application
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = serializers.ReadOnlyField(source="reviewer.username")
    freelancer = serializers.ReadOnlyField(source="freelancer.username")
    freelancer_id = serializers.ReadOnlyField(source="freelancer.id")
    job_title = serializers.ReadOnlyField(source="job.title")

    class Meta:
        model = Review
        fields = [
            "id",
            "job",
            "job_title",
            "reviewer",
            "freelancer",
            "freelancer_id",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "reviewer",
            "freelancer",
            "freelancer_id",
            "job_title",
            "created_at",
            "updated_at",
        ]

    def validate_job(self, job):
        request = self.context["request"]

        if job.client_id != request.user.id:
            raise serializers.ValidationError("Only the client who owns this job can leave a review.")

        if job.status != "Completed":
            raise serializers.ValidationError("Only completed jobs can be reviewed.")

        if Review.objects.filter(job=job).exists():
            raise serializers.ValidationError("This job has already been reviewed.")

        accepted_application = Application.objects.filter(
            job=job,
            status="Accepted",
        ).first()
        if not accepted_application:
            raise serializers.ValidationError("A review requires an accepted freelancer application.")

        if accepted_application.freelancer_id == request.user.id:
            raise serializers.ValidationError("Freelancers cannot review themselves.")

        self.accepted_freelancer = accepted_application.freelancer
        return job

    def create(self, validated_data):
        return Review.objects.create(
            reviewer=self.context["request"].user,
            freelancer=self.accepted_freelancer,
            **validated_data,
        )

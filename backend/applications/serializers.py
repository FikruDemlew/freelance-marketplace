from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):

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
            "status",
            "created_at",
        ]

    def validate(self, attrs):

        request = self.context.get("request")
        job = attrs.get("job")

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
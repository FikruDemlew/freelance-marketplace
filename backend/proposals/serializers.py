from rest_framework import serializers
from .models import Proposal


class ProposalSerializer(serializers.ModelSerializer):

    freelancer = serializers.ReadOnlyField(
        source="freelancer.username"
    )

    job_title = serializers.ReadOnlyField(
        source="job.title"
    )

    class Meta:
        model = Proposal

        fields = [
            "id",
            "job",
            "job_title",
            "freelancer",
            "cover_letter",
            "bid_amount",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "freelancer",
            "job_title",
            "status",
            "created_at",
        ]
from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    freelancer = serializers.ReadOnlyField(source='freelancer.username')
    freelancer_id = serializers.ReadOnlyField(source='freelancer.id')
    job_title = serializers.ReadOnlyField(source='job.title')

    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'job_title',
            'freelancer',
            'freelancer_id',
            'proposal',
            'bid_amount',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']
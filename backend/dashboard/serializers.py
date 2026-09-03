from rest_framework import serializers

from accounts.serializers import CurrentProfileSerializer
from applications.serializers import ApplicationSerializer
from jobs.serializers import JobSerializer
from notifications.serializers import NotificationSerializer
from reviews.serializers import ReviewSerializer


class ReviewsSummarySerializer(serializers.Serializer):
    rating = serializers.FloatField(allow_null=True)
    reviews_count = serializers.IntegerField()
    recent_reviews = ReviewSerializer(many=True)


class FreelancerDashboardSerializer(serializers.Serializer):
    profile_summary = CurrentProfileSerializer()
    total_applications = serializers.IntegerField()
    pending_applications = serializers.IntegerField()
    accepted_applications = serializers.IntegerField()
    rejected_applications = serializers.IntegerField()
    completed_jobs = serializers.IntegerField()
    active_jobs = serializers.IntegerField()
    unread_notifications_count = serializers.IntegerField()
    recent_applications = ApplicationSerializer(many=True)
    recent_notifications = NotificationSerializer(many=True)
    reviews_summary = ReviewsSummarySerializer()


class ClientDashboardSerializer(serializers.Serializer):
    profile_summary = CurrentProfileSerializer()
    total_jobs_posted = serializers.IntegerField()
    open_jobs = serializers.IntegerField()
    in_progress_jobs = serializers.IntegerField()
    completed_jobs = serializers.IntegerField()
    total_applications_received = serializers.IntegerField()
    pending_applications = serializers.IntegerField()
    unread_notifications_count = serializers.IntegerField()
    recent_jobs = JobSerializer(many=True)
    recent_applications = ApplicationSerializer(many=True)
    reviews_summary = ReviewsSummarySerializer()

from django.db.models import Avg
from drf_spectacular.utils import extend_schema
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import CurrentProfileSerializer
from applications.models import Application
from applications.serializers import ApplicationSerializer
from jobs.models import Job
from jobs.serializers import JobSerializer
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from reviews.serializers import ReviewSerializer

from .permissions import IsClient, IsFreelancer
from .serializers import ClientDashboardSerializer, FreelancerDashboardSerializer


class FreelancerDashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsFreelancer]

    @extend_schema(
        summary="Get freelancer dashboard metrics",
        description="Returns profile summary, application stats, active/completed job counts, unread notifications, recent applications, recent notifications, and rating summary for the logged-in freelancer.",
        responses={200: FreelancerDashboardSerializer},
        tags=["Dashboard"],
    )
    def get(self, request):
        user = request.user
        profile = user.profile

        apps_qs = Application.objects.filter(freelancer=user)

        total_applications = apps_qs.count()
        pending_applications = apps_qs.filter(status="Pending").count()
        accepted_applications = apps_qs.filter(status="Accepted").count()
        rejected_applications = apps_qs.filter(status="Rejected").count()

        completed_jobs = apps_qs.filter(
            status="Accepted", job__status="Completed"
        ).count()
        active_jobs = apps_qs.filter(
            status="Accepted", job__status="In Progress"
        ).count()

        unread_notifications_count = Notification.objects.filter(
            recipient=user, is_read=False
        ).count()

        recent_applications = apps_qs.select_related("job", "freelancer").order_by("-created_at")[:5]
        recent_notifications = Notification.objects.filter(recipient=user).order_by("-created_at")[:5]

        reviews_received = user.reviews_received.select_related("job", "reviewer", "freelancer")
        avg_rating = reviews_received.aggregate(avg=Avg("rating"))["avg"]
        reviews_count = reviews_received.count()
        recent_reviews = reviews_received.order_by("-created_at")[:5]

        data = {
            "profile_summary": CurrentProfileSerializer(profile, context={"request": request}).data,
            "total_applications": total_applications,
            "pending_applications": pending_applications,
            "accepted_applications": accepted_applications,
            "rejected_applications": rejected_applications,
            "completed_jobs": completed_jobs,
            "active_jobs": active_jobs,
            "unread_notifications_count": unread_notifications_count,
            "recent_applications": ApplicationSerializer(recent_applications, many=True, context={"request": request}).data,
            "recent_notifications": NotificationSerializer(recent_notifications, many=True, context={"request": request}).data,
            "reviews_summary": {
                "rating": round(avg_rating, 2) if avg_rating is not None else None,
                "reviews_count": reviews_count,
                "recent_reviews": ReviewSerializer(recent_reviews, many=True, context={"request": request}).data,
            },
        }

        return Response(data, status=status.HTTP_200_OK)


class ClientDashboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsClient]

    @extend_schema(
        summary="Get client dashboard metrics",
        description="Returns profile summary, posted job stats, applications received stats, unread notifications, recent jobs, recent applications, and rating summary for the logged-in client.",
        responses={200: ClientDashboardSerializer},
        tags=["Dashboard"],
    )
    def get(self, request):
        user = request.user
        profile = user.profile

        jobs_qs = Job.objects.filter(client=user)

        total_jobs_posted = jobs_qs.count()
        open_jobs = jobs_qs.filter(status="Open").count()
        in_progress_jobs = jobs_qs.filter(status="In Progress").count()
        completed_jobs = jobs_qs.filter(status="Completed").count()

        apps_received_qs = Application.objects.filter(job__client=user)
        total_applications_received = apps_received_qs.count()
        pending_applications = apps_received_qs.filter(status="Pending").count()

        unread_notifications_count = Notification.objects.filter(
            recipient=user, is_read=False
        ).count()

        recent_jobs = jobs_qs.select_related("client").order_by("-created_at")[:5]
        recent_applications = apps_received_qs.select_related("job", "freelancer").order_by("-created_at")[:5]

        reviews_received = user.reviews_received.select_related("job", "reviewer", "freelancer")
        avg_rating = reviews_received.aggregate(avg=Avg("rating"))["avg"]
        reviews_count = reviews_received.count()
        recent_reviews = reviews_received.order_by("-created_at")[:5]

        data = {
            "profile_summary": CurrentProfileSerializer(profile, context={"request": request}).data,
            "total_jobs_posted": total_jobs_posted,
            "open_jobs": open_jobs,
            "in_progress_jobs": in_progress_jobs,
            "completed_jobs": completed_jobs,
            "total_applications_received": total_applications_received,
            "pending_applications": pending_applications,
            "unread_notifications_count": unread_notifications_count,
            "recent_jobs": JobSerializer(recent_jobs, many=True, context={"request": request}).data,
            "recent_applications": ApplicationSerializer(recent_applications, many=True, context={"request": request}).data,
            "reviews_summary": {
                "rating": round(avg_rating, 2) if avg_rating is not None else None,
                "reviews_count": reviews_count,
                "recent_reviews": ReviewSerializer(recent_reviews, many=True, context={"request": request}).data,
            },
        }

        return Response(data, status=status.HTTP_200_OK)

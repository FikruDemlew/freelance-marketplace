from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

from .models import Application
from .serializers import ApplicationSerializer
from .permissions import IsApplicationOwnerOrReadOnly
from jobs.models import Job


class ApplicationListCreateAPIView(
    generics.ListCreateAPIView
):

    serializer_class = ApplicationSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):

        user = self.request.user

        if user.profile.role == "freelancer":
            return Application.objects.filter(
                freelancer=user
            )

        if user.profile.role == "client":
            return Application.objects.filter(
                job__client=user
            )

        return Application.objects.none()

    def perform_create(self, serializer):

        if self.request.user.profile.role != "freelancer":
            raise PermissionDenied(
                "Only freelancers can apply for jobs."
            )

        serializer.save(
            freelancer=self.request.user
        )


class ApplicationDetailAPIView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    permission_classes = [
        IsAuthenticated,
        IsApplicationOwnerOrReadOnly,
    ]

    @transaction.atomic
    def perform_update(self, serializer):
        job = Job.objects.select_for_update().get(
            pk=serializer.instance.job_id
        )

        if serializer.validated_data.get("status") == "Accepted":
            already_accepted = Application.objects.filter(
                job=job,
                status="Accepted",
            ).exclude(
                pk=serializer.instance.pk,
            ).exists()

            if already_accepted:
                raise PermissionDenied(
                    "This job already has an accepted application."
                )

        application = serializer.save()

        if application.status == "Accepted":
            job.status = "In Progress"
            job.save(update_fields=["status"])

            Application.objects.filter(
                job=job,
                status="Pending",
            ).exclude(
                pk=application.pk,
            ).update(status="Rejected")
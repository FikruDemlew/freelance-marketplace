from django.db.models import Q
from rest_framework import generics, permissions, serializers
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Application
from .serializers import ApplicationSerializer
from .permissions import IsApplicationParticipant


@extend_schema_view(
    get=extend_schema(
        summary="List applications",
        description="Returns applications created by the user (if freelancer) or received for jobs posted by the user (if client)."
    ),
    post=extend_schema(
        summary="Apply for a job",
        description="Creates an application for a job. Clients cannot apply to their own jobs, and freelancers cannot apply twice to the same job."
    )
)
class ApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(
            Q(freelancer=user) | Q(job__client=user)
        ).distinct()

    def perform_create(self, serializer):
        job = serializer.validated_data['job']

        if job.client == self.request.user:
            raise serializers.ValidationError({"detail": "You cannot apply to your own job."})

        if Application.objects.filter(job=job, freelancer=self.request.user).exists():
            raise serializers.ValidationError({"detail": "You have already applied to this job."})

        serializer.save(freelancer=self.request.user)


@extend_schema(
    summary="Retrieve or update application details",
    description="Fetch or edit a specific application. Only the applying freelancer can update proposal and bid amount."
)
class ApplicationDetailView(generics.RetrieveUpdateAPIView):  # Changed from RetrieveAPIView
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsApplicationParticipant]
from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Job
from .serializers import JobSerializer
from .permissions import IsClient, IsJobOwnerOrReadOnly


class JobListCreateAPIView(generics.ListCreateAPIView):

    queryset = Job.objects.filter(status="Open")
    serializer_class = JobSerializer

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def perform_create(self, serializer):

        if self.request.user.profile.role != "client":
            raise PermissionDenied(
                "Only clients can create jobs."
            )

        serializer.save(
            client=self.request.user
        )


class MyJobsListAPIView(generics.ListAPIView):

    serializer_class = JobSerializer
    permission_classes = [IsClient]

    def get_queryset(self):
        return Job.objects.filter(
            client=self.request.user
        ).prefetch_related("applications")


class JobDetailAPIView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Job.objects.all()
    serializer_class = JobSerializer

    permission_classes = [
        IsJobOwnerOrReadOnly
    ]
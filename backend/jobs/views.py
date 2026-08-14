from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Job
from .serializers import JobSerializer
from .permissions import IsJobOwnerOrReadOnly


class JobListCreateAPIView(generics.ListCreateAPIView):

    queryset = Job.objects.all()
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


class JobDetailAPIView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Job.objects.all()
    serializer_class = JobSerializer

    permission_classes = [
        IsJobOwnerOrReadOnly
    ]
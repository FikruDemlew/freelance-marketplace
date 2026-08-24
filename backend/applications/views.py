from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Application
from .serializers import ApplicationSerializer
from .permissions import IsApplicationOwnerOrReadOnly


class ApplicationListCreateAPIView(
    generics.ListCreateAPIView
):

    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def perform_create(self, serializer):

        # Only freelancers can apply
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
        IsApplicationOwnerOrReadOnly
    ]
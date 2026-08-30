from django.db import IntegrityError, transaction
from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError

from .models import Review
from .serializers import ReviewSerializer


class ReviewListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = Review.objects.select_related("job", "reviewer", "freelancer")
        job_id = self.request.query_params.get("job")
        freelancer_id = self.request.query_params.get("freelancer_id")

        if job_id:
            queryset = queryset.filter(job_id=job_id)
        if freelancer_id:
            queryset = queryset.filter(freelancer_id=freelancer_id)
        return queryset

    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                serializer.save()
        except IntegrityError as error:
            raise ValidationError({"job": "This job has already been reviewed."}) from error


class ReviewDetailAPIView(generics.RetrieveAPIView):
    queryset = Review.objects.select_related("job", "reviewer", "freelancer")
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

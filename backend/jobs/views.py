from decimal import Decimal, InvalidOperation

from django.db import IntegrityError, transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Job, SavedJob
from .permissions import IsClient, IsJobOwnerOrReadOnly
from .serializers import JobSerializer, SavedJobSerializer


class JobPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


class JobListCreateAPIView(generics.ListCreateAPIView):

    queryset = Job.objects.filter(status="Open")
    serializer_class = JobSerializer
    pagination_class = JobPagination

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]

    def get_queryset(self):
        queryset = Job.objects.filter(status="Open")
        params = self.request.query_params

        search = params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        category = params.get("category", "").strip()
        if category:
            queryset = queryset.filter(category__iexact=category)

        min_budget = self._parse_budget(params.get("min_budget"), "min_budget")
        if min_budget is not None:
            queryset = queryset.filter(budget__gte=min_budget)

        max_budget = self._parse_budget(params.get("max_budget"), "max_budget")
        if max_budget is not None:
            queryset = queryset.filter(budget__lte=max_budget)

        requested_status = params.get("status", "").strip()
        if requested_status:
            queryset = queryset.filter(status__iexact=requested_status)

        deadline = params.get("deadline", "").strip()
        if deadline:
            queryset = queryset.filter(deadline=deadline)

        return queryset.select_related("client").prefetch_related("applications").order_by(
            "-created_at", "-id"
        )

    @staticmethod
    def _parse_budget(value, field_name):
        if not value:
            return None
        try:
            return Decimal(value)
        except (InvalidOperation, ValueError):
            raise ValidationError({field_name: "Enter a valid budget amount."})

    def perform_create(self, serializer):

        profile = getattr(self.request.user, "profile", None)
        if not profile or profile.role != "client":
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


class SavedJobListAPIView(generics.ListAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="List saved jobs for current user",
        description="Returns list of jobs saved by the authenticated user.",
        tags=["Jobs"],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).select_related("job", "job__client").order_by("-created_at")


class SaveJobAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        summary="Save a job",
        description="Saves a job for the logged-in user. Returns 400 if already saved.",
        request=None,
        responses={201: SavedJobSerializer},
        tags=["Jobs"],
    )
    def post(self, request, job_id):
        job = get_object_or_404(Job, pk=job_id)
        try:
            with transaction.atomic():
                saved_job = SavedJob.objects.create(
                    user=request.user,
                    job=job,
                )
        except IntegrityError:
            return Response(
                {"detail": "You have already saved this job."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = SavedJobSerializer(saved_job)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Remove a saved job",
        description="Removes a saved job for the logged-in user. Returns 404 if not found.",
        responses={204: None},
        tags=["Jobs"],
    )
    def delete(self, request, job_id):
        job = get_object_or_404(Job, pk=job_id)
        saved_job = SavedJob.objects.filter(user=request.user, job=job).first()
        if not saved_job:
            return Response(
                {"detail": "Saved job not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        saved_job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

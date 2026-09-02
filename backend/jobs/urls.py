from django.urls import path

from .views import (
    JobListCreateAPIView,
    MyJobsListAPIView,
    JobDetailAPIView,
    SavedJobListAPIView,
    SaveJobAPIView,
)


urlpatterns = [

    path(
        "my-jobs/",
        MyJobsListAPIView.as_view(),
        name="my-jobs",
    ),

    path(
        "saved/",
        SavedJobListAPIView.as_view(),
        name="saved-jobs-list",
    ),

    path(
        "<int:job_id>/save/",
        SaveJobAPIView.as_view(),
        name="job-save",
    ),

    path(
        "",
        JobListCreateAPIView.as_view(),
        name="job-list-create",
    ),

    path(
        "<int:pk>/",
        JobDetailAPIView.as_view(),
        name="job-detail",
    ),

]
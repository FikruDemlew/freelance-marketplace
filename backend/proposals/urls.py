from django.urls import path

from .views import (
    ProposalCreateAPIView,
    MyProposalsAPIView,
    JobProposalsAPIView,
)


urlpatterns = [
    path(
        "create/",
        ProposalCreateAPIView.as_view()
    ),

    path(
        "",
        MyProposalsAPIView.as_view()
    ),
    path(
    "job/<int:job_id>/",
    JobProposalsAPIView.as_view()
),
]
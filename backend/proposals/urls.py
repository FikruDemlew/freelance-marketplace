from django.urls import path

from .views import (
    ProposalCreateAPIView,
    MyProposalsAPIView,
    JobProposalsAPIView,
    ProposalStatusAPIView,
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
    path(
    "<int:proposal_id>/status/",
    ProposalStatusAPIView.as_view()
),
]
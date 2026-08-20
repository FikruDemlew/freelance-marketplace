from django.urls import path

from .views import (
    ProposalCreateAPIView,
    MyProposalsAPIView,
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
]
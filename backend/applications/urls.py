from django.urls import path

from .views import (
    ApplicationListCreateAPIView,
    ApplicationDetailAPIView,
)


urlpatterns = [

    path(
        "",
        ApplicationListCreateAPIView.as_view(),
        name="application-list-create",
    ),

    path(
        "<int:pk>/",
        ApplicationDetailAPIView.as_view(),
        name="application-detail",
    ),

]
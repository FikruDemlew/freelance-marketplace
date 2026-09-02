from django.urls import path
from .views import ClientDashboardAPIView, FreelancerDashboardAPIView

urlpatterns = [
    path("freelancer/", FreelancerDashboardAPIView.as_view(), name="freelancer-dashboard"),
    path("client/", ClientDashboardAPIView.as_view(), name="client-dashboard"),
]

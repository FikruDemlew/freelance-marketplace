from django.urls import path

from .views import NotificationDetailAPIView, NotificationListAPIView


urlpatterns = [
    path("", NotificationListAPIView.as_view(), name="notification-list"),
    path("<int:pk>/", NotificationDetailAPIView.as_view(), name="notification-detail"),
]

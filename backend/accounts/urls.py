from django.urls import path
from .views import (
    RegisterAPIView,
    LoginAPIView,
    MeAPIView,
    CurrentProfileAPIView,
    PublicProfileAPIView,
)
from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [

    path(
        "register/",
        RegisterAPIView.as_view()
    ),

    path(
        "login/",
        LoginAPIView.as_view()
    ),
    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),
    path(
        "me/",
        MeAPIView.as_view()
    ),
    path(
        "profile/",
        CurrentProfileAPIView.as_view(),
        name="current-profile",
    ),
    path(
        "profiles/<int:user_id>/",
        PublicProfileAPIView.as_view(),
        name="public-profile",
    ),

]

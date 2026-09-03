from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    CurrentProfileSerializer,
    PublicProfileSerializer,
)
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Profile

class RegisterAPIView(APIView):
    
    @extend_schema(
        summary="Register a new user",
        description="Create a new user account with a client or freelancer role.",
        request=RegisterSerializer,
        responses={201: OpenApiTypes.OBJECT, 400: OpenApiTypes.OBJECT},
    )

    def post(self, request):

        serializer = RegisterSerializer(
            data=request.data
        )


        if serializer.is_valid():

            serializer.save()

            return Response(
                {
                    "message": "User registered successfully"
                },
                status=status.HTTP_201_CREATED
            )


        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
        
class LoginAPIView(APIView):

    @extend_schema(
        request=LoginSerializer,
        responses={200: OpenApiTypes.OBJECT, 401: OpenApiTypes.OBJECT},
    )
    
    def post(self, request):

        username = request.data.get(
            "username"
        )

        password = request.data.get(
            "password"
        )


        user = authenticate(
            username=username,
            password=password
        )


        if user:

            refresh = RefreshToken.for_user(
                user
            )


            return Response({

                "refresh": str(refresh),

                "access": str(refresh.access_token),

            })


        return Response(
            {
                "error": "Invalid credentials"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )
        
class MeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: OpenApiTypes.OBJECT})
    def get(self, request):
    
        try:
            profile = request.user.profile
            return Response({
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "role": profile.role,
            })
        except:
            return Response({
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            })


class CurrentProfileAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CurrentProfileSerializer

    @extend_schema(
        summary="Get or update the current user's profile",
        tags=["Profiles"],
    )
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Update the current user's profile",
        tags=["Profiles"],
    )
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def get_object(self):
        return get_object_or_404(
            Profile.objects.select_related("user"),
            user=self.request.user,
        )


class PublicProfileAPIView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PublicProfileSerializer
    queryset = Profile.objects.select_related("user")
    lookup_field = "user_id"
    lookup_url_kwarg = "user_id"

    @extend_schema(
        summary="View a user's public profile",
        description=(
            "Returns role-appropriate public profile fields. "
            "Email and phone are never included."
        ),
        tags=["Profiles"],
    )
    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

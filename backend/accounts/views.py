from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import RegisterSerializer

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

class RegisterAPIView(APIView):

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
    def get(self, request):
    
        profile = request.user.profile
        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "role": profile.role,
        })
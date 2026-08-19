from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile


class LoginSerializer(serializers.Serializer):

    username = serializers.CharField()
    password = serializers.CharField(
        write_only=True
    )

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True
    )

    role = serializers.CharField(
        write_only=True
    )


    class Meta:
        model = User

        fields = [
            "username",
            "email",
            "password",
            "role"
        ]


    def create(self, validated_data):

        role = validated_data.pop("role")

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )


        Profile.objects.create(
            user=user,
            role=role
        )


        return user
from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Avg
from drf_spectacular.utils import extend_schema_field
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

    role = serializers.ChoiceField(
        choices=Profile.ROLE_CHOICES,
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


class ProfileBaseSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)
    first_name = serializers.CharField(
        source="user.first_name",
        max_length=150,
        required=False,
        allow_blank=True,
    )
    last_name = serializers.CharField(
        source="user.last_name",
        max_length=150,
        required=False,
        allow_blank=True,
    )
    display_name = serializers.SerializerMethodField()
    profile_image = serializers.ImageField(required=False, allow_null=True)
    skills = serializers.ListField(
        child=serializers.CharField(max_length=50, trim_whitespace=True),
        required=False,
        allow_empty=True,
    )
    hourly_rate = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=0,
        required=False,
        allow_null=True,
    )
    rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    jobs_posted = serializers.SerializerMethodField()
    jobs_completed = serializers.SerializerMethodField()

    freelancer_only_fields = {
        "skills",
        "experience",
        "hourly_rate",
        "portfolio_url",
        "github_url",
        "linkedin_url",
    }
    client_only_fields = {"company_name", "website"}

    class Meta:
        model = Profile
        fields = [
            "id",
            "user_id",
            "username",
            "first_name",
            "last_name",
            "display_name",
            "role",
            "profile_image",
            "bio",
            "location",
            "skills",
            "experience",
            "hourly_rate",
            "portfolio_url",
            "github_url",
            "linkedin_url",
            "company_name",
            "website",
            "rating",
            "reviews_count",
            "jobs_posted",
            "jobs_completed",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "user_id",
            "username",
            "display_name",
            "role",
            "rating",
            "reviews_count",
            "jobs_posted",
            "jobs_completed",
            "created_at",
            "updated_at",
        ]

    @extend_schema_field(serializers.CharField)
    def get_display_name(self, obj) -> str:
        full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full_name or obj.company_name or obj.user.username

    @extend_schema_field(serializers.FloatField(allow_null=True))
    def get_rating(self, obj) -> float | None:
        return obj.user.reviews_received.aggregate(average=Avg("rating"))["average"]

    @extend_schema_field(serializers.IntegerField)
    def get_reviews_count(self, obj) -> int:
        return obj.user.reviews_received.count()

    @extend_schema_field(serializers.IntegerField)
    def get_jobs_posted(self, obj) -> int:
        return obj.user.jobs.count()

    @extend_schema_field(serializers.IntegerField)
    def get_jobs_completed(self, obj) -> int:
        if obj.role == "freelancer":
            return obj.user.job_applications.filter(
                status="Accepted",
                job__status="Completed",
            ).count()
        return obj.user.jobs.filter(status="Completed").count()

    def validate(self, attrs):
        profile = self.instance
        if not profile:
            return attrs

        invalid_fields = (
            self.client_only_fields
            if profile.role == "freelancer"
            else self.freelancer_only_fields
        )
        submitted_invalid_fields = invalid_fields.intersection(attrs.keys())
        if submitted_invalid_fields:
            raise serializers.ValidationError({
                field: "This field is not available for your profile role."
                for field in submitted_invalid_fields
            })
        return attrs

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        for field, value in user_data.items():
            setattr(instance.user, field, value)

        if user_data:
            instance.user.save(update_fields=list(user_data.keys()))

        return super().update(instance, validated_data)


class CurrentProfileSerializer(ProfileBaseSerializer):
    email = serializers.EmailField(source="user.email", required=False)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)

    class Meta(ProfileBaseSerializer.Meta):
        fields = ProfileBaseSerializer.Meta.fields + ["email", "phone"]

    def validate_email(self, value):
        user = self.instance.user
        if User.objects.exclude(pk=user.pk).filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value


class PublicProfileSerializer(ProfileBaseSerializer):
    class Meta(ProfileBaseSerializer.Meta):
        read_only_fields = ProfileBaseSerializer.Meta.fields

    def to_representation(self, instance):
        data = super().to_representation(instance)
        role_specific_fields = (
            self.client_only_fields
            if instance.role == "freelancer"
            else self.freelancer_only_fields
        )
        for field in role_specific_fields:
            data.pop(field, None)
        return data

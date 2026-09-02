from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class Profile(models.Model):

    ROLE_CHOICES = (
        ("freelancer", "Freelancer"),
        ("client", "Client"),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    bio = models.TextField(
        blank=True
    )

    phone = models.CharField(
        max_length=20,
        blank=True
    )

    profile_image = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )

    location = models.CharField(
        max_length=120,
        blank=True,
    )

    skills = models.JSONField(
        default=list,
        blank=True,
    )

    experience = models.TextField(
        blank=True,
    )

    hourly_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )

    portfolio_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    company_name = models.CharField(
        max_length=200,
        blank=True,
    )

    website = models.URLField(blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.user.username

from decimal import Decimal

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from applications.models import Application
from jobs.models import Job
from reviews.models import Review

from .models import Profile


class ProfileAPITests(TestCase):
    def setUp(self):
        self.api = APIClient()
        self.client_user = self.create_user("client", "client", "client@example.com")
        self.freelancer = self.create_user(
            "freelancer",
            "freelancer",
            "freelancer@example.com",
        )
        self.other_user = self.create_user("other", "freelancer", "other@example.com")
        self.job = Job.objects.create(
            client=self.client_user,
            title="Completed project",
            description="Project description",
            category="Web Development",
            budget=Decimal("100.00"),
            deadline="2030-01-01",
            status="Completed",
        )
        Application.objects.create(
            job=self.job,
            freelancer=self.freelancer,
            proposal="I can do this.",
            bid_amount=Decimal("90.00"),
            status="Accepted",
        )
        Review.objects.create(
            job=self.job,
            reviewer=self.client_user,
            freelancer=self.freelancer,
            rating=5,
            comment="Excellent work.",
        )

    def create_user(self, username, role, email):
        user = User.objects.create_user(
            username=username,
            password="password",
            email=email,
        )
        Profile.objects.create(user=user, role=role)
        return user

    def test_freelancer_can_get_and_update_only_their_profile(self):
        self.api.force_authenticate(self.freelancer)
        response = self.api.patch(
            "/api/auth/profile/",
            {
                "first_name": "Ada",
                "last_name": "Lovelace",
                "bio": "Backend developer",
                "skills": ["Python", "Django"],
                "experience": "Five years of web development.",
                "location": "Addis Ababa",
                "hourly_rate": "42.50",
                "portfolio_url": "https://portfolio.example.com",
                "github_url": "https://github.com/ada",
                "linkedin_url": "https://linkedin.com/in/ada",
                "email": "ada@example.com",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["display_name"], "Ada Lovelace")
        self.assertEqual(response.data["skills"], ["Python", "Django"])
        self.assertEqual(response.data["rating"], 5.0)
        self.assertEqual(response.data["reviews_count"], 1)
        self.assertEqual(response.data["jobs_completed"], 1)
        self.freelancer.refresh_from_db()
        self.assertEqual(self.freelancer.email, "ada@example.com")

    def test_client_profile_accepts_company_fields_and_rejects_freelancer_fields(self):
        self.api.force_authenticate(self.client_user)
        success = self.api.patch(
            "/api/auth/profile/",
            {
                "company_name": "Acme Studio",
                "website": "https://acme.example.com",
                "location": "Nairobi",
            },
            format="json",
        )
        self.assertEqual(success.status_code, 200, success.data)
        self.assertEqual(success.data["company_name"], "Acme Studio")

        rejected = self.api.patch(
            "/api/auth/profile/",
            {"skills": ["Python"]},
            format="json",
        )
        self.assertEqual(rejected.status_code, 400)
        self.assertIn("skills", rejected.data)

    def test_public_profile_hides_email_phone_and_exposes_stats(self):
        profile = self.freelancer.profile
        profile.phone = "555-0100"
        profile.skills = ["Django"]
        profile.save()

        response = self.api.get(f"/api/auth/profiles/{self.freelancer.id}/")

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["username"], "freelancer")
        self.assertEqual(response.data["rating"], 5.0)
        self.assertEqual(response.data["reviews_count"], 1)
        self.assertEqual(response.data["jobs_completed"], 1)
        self.assertNotIn("email", response.data)
        self.assertNotIn("phone", response.data)

    def test_current_profile_is_authenticated_and_public_profiles_are_read_only(self):
        self.assertEqual(self.api.get("/api/auth/profile/").status_code, 401)
        self.assertEqual(
            self.api.patch(
                f"/api/auth/profiles/{self.freelancer.id}/",
                {"bio": "Attempted change"},
                format="json",
            ).status_code,
            405,
        )

        self.api.force_authenticate(self.other_user)
        response = self.api.get("/api/auth/profile/")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["user_id"], self.other_user.id)

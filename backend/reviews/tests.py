from datetime import date

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import Profile
from applications.models import Application
from jobs.models import Job
from .models import Review


class ReviewAPITests(APITestCase):
    def setUp(self):
        self.client_user = User.objects.create_user("client", password="password123")
        self.other_client = User.objects.create_user("other-client", password="password123")
        self.freelancer = User.objects.create_user("freelancer", password="password123")
        Profile.objects.create(user=self.client_user, role="client")
        Profile.objects.create(user=self.other_client, role="client")
        Profile.objects.create(user=self.freelancer, role="freelancer")
        self.job = Job.objects.create(
            client=self.client_user,
            title="Completed job",
            description="A completed project",
            category="Web Development",
            budget="100.00",
            deadline=date.today(),
            status="Completed",
        )
        Application.objects.create(
            job=self.job,
            freelancer=self.freelancer,
            proposal="I can do this.",
            bid_amount="90.00",
            status="Accepted",
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_client_can_review_completed_job_and_freelancer_is_derived(self):
        self.authenticate(self.client_user)
        response = self.client.post(
            "/api/reviews/",
            {"job": self.job.id, "rating": 5, "comment": "Excellent work."},
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        review = Review.objects.get(job=self.job)
        self.assertEqual(review.reviewer, self.client_user)
        self.assertEqual(review.freelancer, self.freelancer)

    def test_job_can_only_be_reviewed_once(self):
        Review.objects.create(
            job=self.job,
            reviewer=self.client_user,
            freelancer=self.freelancer,
            rating=5,
            comment="Excellent work.",
        )
        self.authenticate(self.client_user)
        response = self.client.post(
            "/api/reviews/",
            {"job": self.job.id, "rating": 4, "comment": "Another review."},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_only_owner_can_review_and_freelancer_cannot_review(self):
        self.authenticate(self.other_client)
        response = self.client.post(
            "/api/reviews/",
            {"job": self.job.id, "rating": 5, "comment": "Not my job."},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        self.authenticate(self.freelancer)
        response = self.client.post(
            "/api/reviews/",
            {"job": self.job.id, "rating": 5, "comment": "Self review."},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_open_and_in_progress_jobs_cannot_be_reviewed(self):
        self.authenticate(self.client_user)
        for job_status in ("Open", "In Progress"):
            self.job.status = job_status
            self.job.save()
            response = self.client.post(
                "/api/reviews/",
                {"job": self.job.id, "rating": 5, "comment": "Too early."},
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_rating_bounds_and_freelancer_filter(self):
        self.authenticate(self.client_user)
        for rating in (0, 6):
            response = self.client.post(
                "/api/reviews/",
                {"job": self.job.id, "rating": rating, "comment": "Invalid rating."},
            )
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        Review.objects.create(
            job=self.job,
            reviewer=self.client_user,
            freelancer=self.freelancer,
            rating=5,
            comment="Excellent work.",
        )
        self.client.force_authenticate(user=None)
        response = self.client.get(f"/api/reviews/?freelancer_id={self.freelancer.id}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["freelancer_id"], self.freelancer.id)

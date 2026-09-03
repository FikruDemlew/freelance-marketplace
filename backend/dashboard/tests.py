from decimal import Decimal

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import Profile
from applications.models import Application
from jobs.models import Job
from notifications.models import Notification
from reviews.models import Review


class DashboardAPITests(TestCase):
    def setUp(self):
        self.api = APIClient()

        # Users
        self.client_user = self.create_user("client_user", "client", "client@example.com")
        self.freelancer_user = self.create_user("freelancer_user", "freelancer", "freelancer@example.com")
        self.other_client = self.create_user("other_client", "client", "other_client@example.com")
        self.other_freelancer = self.create_user("other_freelancer", "freelancer", "other_freelancer@example.com")

        # Jobs posted by client_user
        self.open_job = Job.objects.create(
            client=self.client_user,
            title="Open Web App",
            description="Need a fullstack web app.",
            category="Web Development",
            budget=Decimal("500.00"),
            deadline="2030-01-01",
            status="Open",
        )
        self.in_progress_job = Job.objects.create(
            client=self.client_user,
            title="In Progress Mobile App",
            description="Flutter app building.",
            category="Mobile Development",
            budget=Decimal("800.00"),
            deadline="2030-02-01",
            status="In Progress",
        )
        self.completed_job = Job.objects.create(
            client=self.client_user,
            title="Completed Design Job",
            description="UI design completed.",
            category="UI/UX Design",
            budget=Decimal("300.00"),
            deadline="2030-03-01",
            status="Completed",
        )

        # Job posted by other_client
        self.other_job = Job.objects.create(
            client=self.other_client,
            title="Other Client Job",
            description="Unrelated project.",
            category="Writing",
            budget=Decimal("150.00"),
            deadline="2030-04-01",
            status="Open",
        )

        # Applications by freelancer_user
        self.pending_app = Application.objects.create(
            job=self.open_job,
            freelancer=self.freelancer_user,
            proposal="I can build your web app.",
            bid_amount=Decimal("450.00"),
            status="Pending",
        )
        self.accepted_app = Application.objects.create(
            job=self.in_progress_job,
            freelancer=self.freelancer_user,
            proposal="I can build your Flutter app.",
            bid_amount=Decimal("750.00"),
            status="Accepted",
        )
        self.completed_app = Application.objects.create(
            job=self.completed_job,
            freelancer=self.freelancer_user,
            proposal="I can design your UI.",
            bid_amount=Decimal("300.00"),
            status="Accepted",
        )

        # Application by other_freelancer to open_job
        self.other_app = Application.objects.create(
            job=self.open_job,
            freelancer=self.other_freelancer,
            proposal="Competing proposal.",
            bid_amount=Decimal("500.00"),
            status="Pending",
        )

        # Notifications
        Notification.objects.create(
            recipient=self.freelancer_user,
            application=self.accepted_app,
            notification_type="status_change",
            message="Your proposal was accepted!",
            is_read=False,
        )
        Notification.objects.create(
            recipient=self.freelancer_user,
            application=self.pending_app,
            notification_type="general",
            message="Welcome to FreelanceHub!",
            is_read=True,
        )
        Notification.objects.create(
            recipient=self.client_user,
            application=self.pending_app,
            notification_type="new_application",
            message="New application received for Open Web App",
            is_read=False,
        )

        # Reviews
        Review.objects.create(
            job=self.completed_job,
            reviewer=self.client_user,
            freelancer=self.freelancer_user,
            rating=5,
            comment="Fantastic freelancer!",
        )

    def create_user(self, username, role, email):
        user = User.objects.create_user(
            username=username,
            password="password123",
            email=email,
        )
        Profile.objects.create(user=user, role=role)
        return user

    def test_unauthenticated_requests_return_401(self):
        resp_freelancer = self.api.get("/api/dashboard/freelancer/")
        self.assertEqual(resp_freelancer.status_code, 401)

        resp_client = self.api.get("/api/dashboard/client/")
        self.assertEqual(resp_client.status_code, 401)

    def test_role_permission_checks(self):
        # Client trying to access freelancer dashboard -> 403
        self.api.force_authenticate(self.client_user)
        resp_freelancer = self.api.get("/api/dashboard/freelancer/")
        self.assertEqual(resp_freelancer.status_code, 403)
        self.assertIn("Only freelancers can access the freelancer dashboard.", str(resp_freelancer.data))

        # Freelancer trying to access client dashboard -> 403
        self.api.force_authenticate(self.freelancer_user)
        resp_client = self.api.get("/api/dashboard/client/")
        self.assertEqual(resp_client.status_code, 403)
        self.assertIn("Only clients can access the client dashboard.", str(resp_client.data))

    def test_freelancer_dashboard_metrics(self):
        self.api.force_authenticate(self.freelancer_user)
        response = self.api.get("/api/dashboard/freelancer/")

        self.assertEqual(response.status_code, 200, response.data)
        data = response.data

        # Profile summary
        self.assertEqual(data["profile_summary"]["username"], "freelancer_user")
        self.assertEqual(data["profile_summary"]["role"], "freelancer")

        # Application counts
        self.assertEqual(data["total_applications"], 3)
        self.assertEqual(data["pending_applications"], 1)
        self.assertEqual(data["accepted_applications"], 2)
        self.assertEqual(data["rejected_applications"], 0)

        # Job counts
        self.assertEqual(data["completed_jobs"], 1)
        self.assertEqual(data["active_jobs"], 1)

        # Notification count
        self.assertEqual(data["unread_notifications_count"], 1)

        # Recent applications & notifications lists
        self.assertEqual(len(data["recent_applications"]), 3)
        self.assertEqual(len(data["recent_notifications"]), 2)

        # Reviews summary
        self.assertEqual(data["reviews_summary"]["rating"], 5.0)
        self.assertEqual(data["reviews_summary"]["reviews_count"], 1)
        self.assertEqual(len(data["reviews_summary"]["recent_reviews"]), 1)
        self.assertEqual(data["reviews_summary"]["recent_reviews"][0]["comment"], "Fantastic freelancer!")

    def test_client_dashboard_metrics(self):
        self.api.force_authenticate(self.client_user)
        response = self.api.get("/api/dashboard/client/")

        self.assertEqual(response.status_code, 200, response.data)
        data = response.data

        # Profile summary
        self.assertEqual(data["profile_summary"]["username"], "client_user")
        self.assertEqual(data["profile_summary"]["role"], "client")

        # Job counts
        self.assertEqual(data["total_jobs_posted"], 3)
        self.assertEqual(data["open_jobs"], 1)
        self.assertEqual(data["in_progress_jobs"], 1)
        self.assertEqual(data["completed_jobs"], 1)

        # Applications received counts
        self.assertEqual(data["total_applications_received"], 4)
        self.assertEqual(data["pending_applications"], 2)

        # Unread notifications count
        self.assertEqual(data["unread_notifications_count"], 1)

        # Recent jobs & recent applications received
        self.assertEqual(len(data["recent_jobs"]), 3)
        self.assertEqual(len(data["recent_applications"]), 4)

    def test_data_isolation_between_users(self):
        # Other client has 1 job posted and 0 applications received
        self.api.force_authenticate(self.other_client)
        response = self.api.get("/api/dashboard/client/")

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["total_jobs_posted"], 1)
        self.assertEqual(response.data["total_applications_received"], 0)

        # Other freelancer has 1 application submitted
        self.api.force_authenticate(self.other_freelancer)
        response = self.api.get("/api/dashboard/freelancer/")

        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["total_applications"], 1)
        self.assertEqual(response.data["pending_applications"], 1)

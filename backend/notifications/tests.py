from decimal import Decimal

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import Profile
from applications.models import Application
from chat.models import Conversation
from jobs.models import Job

from .models import Notification


class NotificationWorkflowTests(TestCase):
    def setUp(self):
        self.api = APIClient()
        self.client_user = self.create_user("client", "client")
        self.freelancer_one = self.create_user("freelancer-one", "freelancer")
        self.freelancer_two = self.create_user("freelancer-two", "freelancer")
        self.other_user = self.create_user("other-user", "freelancer")
        self.job = Job.objects.create(
            client=self.client_user,
            title="Build a website",
            description="A marketplace website",
            category="Web Development",
            budget=Decimal("1000.00"),
            deadline="2030-01-01",
        )

    def create_user(self, username, role):
        user = User.objects.create_user(username=username, password="password")
        Profile.objects.create(user=user, role=role)
        return user

    def apply(self, freelancer, proposal="I can build this."):
        self.api.force_authenticate(freelancer)
        response = self.api.post(
            "/api/applications/",
            {
                "job": self.job.id,
                "proposal": proposal,
                "bid_amount": "900.00",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        return Application.objects.get(pk=response.data["id"])

    def test_application_status_workflow_creates_expected_notifications(self):
        accepted_application = self.apply(self.freelancer_one)
        rejected_application = self.apply(self.freelancer_two, "Choose me instead.")

        self.assertTrue(Notification.objects.filter(
            recipient=self.client_user,
            application=accepted_application,
            notification_type="application",
        ).exists())

        self.api.force_authenticate(self.client_user)
        response = self.api.patch(
            f"/api/applications/{accepted_application.id}/",
            {"status": "Accepted"},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)

        rejected_application.refresh_from_db()
        self.job.refresh_from_db()
        self.assertEqual(rejected_application.status, "Rejected")
        self.assertEqual(self.job.status, "In Progress")
        self.assertTrue(Notification.objects.filter(
            recipient=self.freelancer_one,
            application=accepted_application,
            notification_type="accepted",
        ).exists())
        self.assertTrue(Notification.objects.filter(
            recipient=self.freelancer_two,
            application=rejected_application,
            notification_type="rejected",
        ).exists())

    def test_manual_rejection_creates_a_notification(self):
        application = self.apply(self.freelancer_one)
        self.api.force_authenticate(self.client_user)

        response = self.api.patch(
            f"/api/applications/{application.id}/",
            {"status": "Rejected"},
            format="json",
        )

        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(Notification.objects.filter(
            recipient=self.freelancer_one,
            application=application,
            notification_type="rejected",
        ).exists())

    def test_notifications_are_private_and_can_be_marked_read(self):
        application = self.apply(self.freelancer_one)
        notification = Notification.objects.get(
            recipient=self.client_user,
            application=application,
            notification_type="application",
        )

        self.api.force_authenticate(self.other_user)
        self.assertEqual(self.api.get("/api/notifications/").data, [])
        self.assertEqual(
            self.api.get(f"/api/notifications/{notification.id}/").status_code,
            404,
        )

        self.api.force_authenticate(self.client_user)
        response = self.api.patch(
            f"/api/notifications/{notification.id}/",
            {"is_read": True},
            format="json",
        )
        self.assertEqual(response.status_code, 200, response.data)
        self.assertTrue(response.data["is_read"])

    def test_new_message_notifies_the_other_conversation_participant(self):
        application = self.apply(self.freelancer_one)
        application.status = "Accepted"
        application.save(update_fields=["status"])
        conversation = Conversation.objects.create(
            application=application,
            client=self.client_user,
            freelancer=self.freelancer_one,
        )

        self.api.force_authenticate(self.freelancer_one)
        response = self.api.post(
            f"/api/chat/{conversation.id}/messages/",
            {"content": "Hello!"},
            format="json",
        )

        self.assertEqual(response.status_code, 201, response.data)
        self.assertTrue(Notification.objects.filter(
            recipient=self.client_user,
            application=application,
            notification_type="message",
        ).exists())

    def test_authentication_completion_and_review_work_after_notifications(self):
        application = self.apply(self.freelancer_one)
        application.status = "Accepted"
        application.save(update_fields=["status"])
        self.job.status = "In Progress"
        self.job.save(update_fields=["status"])

        self.api.force_authenticate(self.client_user)
        completion = self.api.patch(
            f"/api/jobs/{self.job.id}/",
            {"status": "Completed"},
            format="json",
        )
        self.assertEqual(completion.status_code, 200, completion.data)

        review = self.api.post(
            "/api/reviews/",
            {"job": self.job.id, "rating": 5, "comment": "Excellent work."},
            format="json",
        )
        self.assertEqual(review.status_code, 201, review.data)

        unauthenticated_api = APIClient()
        login = unauthenticated_api.post(
            "/api/auth/login/",
            {"username": "client", "password": "password"},
            format="json",
        )
        self.assertEqual(login.status_code, 200, login.data)
        unauthenticated_api.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login.data['access']}"
        )
        self.assertEqual(
            unauthenticated_api.get("/api/auth/me/").data["username"],
            "client",
        )

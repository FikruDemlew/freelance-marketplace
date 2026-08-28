from decimal import Decimal

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import Profile
from jobs.models import Job
from .models import Application


class ApplicationWorkflowTests(TestCase):

	def setUp(self):
		self.client_user = User.objects.create_user(
			username="client",
			password="password",
		)
		Profile.objects.create(user=self.client_user, role="client")

		self.other_client = User.objects.create_user(
			username="other-client",
			password="password",
		)
		Profile.objects.create(user=self.other_client, role="client")

		self.first_freelancer = User.objects.create_user(
			username="freelancer-one",
			password="password",
		)
		Profile.objects.create(user=self.first_freelancer, role="freelancer")

		self.second_freelancer = User.objects.create_user(
			username="freelancer-two",
			password="password",
		)
		Profile.objects.create(user=self.second_freelancer, role="freelancer")

		self.job = Job.objects.create(
			client=self.client_user,
			title="Build a website",
			description="A marketplace website",
			category="Web Development",
			budget=Decimal("1000.00"),
			deadline="2030-01-01",
		)

		self.first_application = Application.objects.create(
			job=self.job,
			freelancer=self.first_freelancer,
			proposal="I can build this.",
			bid_amount=Decimal("900.00"),
		)
		self.second_application = Application.objects.create(
			job=self.job,
			freelancer=self.second_freelancer,
			proposal="I can also build this.",
			bid_amount=Decimal("950.00"),
		)
		self.api_client = APIClient()

	def test_client_sees_only_applications_for_owned_jobs(self):
		self.api_client.force_authenticate(self.client_user)

		response = self.api_client.get("/api/applications/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data), 2)

	def test_freelancer_sees_only_their_applications(self):
		self.api_client.force_authenticate(self.first_freelancer)

		response = self.api_client.get("/api/applications/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]["id"], self.first_application.id)

	def test_client_acceptance_rejects_other_pending_applications(self):
		self.api_client.force_authenticate(self.client_user)

		response = self.api_client.patch(
			f"/api/applications/{self.first_application.id}/",
			{"status": "Accepted"},
			format="json",
		)

		self.assertEqual(response.status_code, 200)
		self.first_application.refresh_from_db()
		self.second_application.refresh_from_db()
		self.job.refresh_from_db()
		self.assertEqual(self.first_application.status, "Accepted")
		self.assertEqual(self.second_application.status, "Rejected")
		self.assertEqual(self.job.status, "In Progress")

	def test_client_cannot_accept_another_application_after_acceptance(self):
		self.api_client.force_authenticate(self.client_user)
		self.first_application.status = "Accepted"
		self.first_application.save(update_fields=["status"])

		response = self.api_client.patch(
			f"/api/applications/{self.second_application.id}/",
			{"status": "Accepted"},
			format="json",
		)

		self.assertEqual(response.status_code, 403)
		self.second_application.refresh_from_db()
		self.assertEqual(self.second_application.status, "Pending")

	def test_only_job_owner_can_complete_in_progress_job(self):
		self.job.status = "In Progress"
		self.job.save(update_fields=["status"])
		self.api_client.force_authenticate(self.client_user)

		response = self.api_client.patch(
			f"/api/jobs/{self.job.id}/",
			{"status": "Completed"},
			format="json",
		)

		self.assertEqual(response.status_code, 200)
		self.job.refresh_from_db()
		self.assertEqual(self.job.status, "Completed")

	def test_open_job_cannot_be_completed_directly(self):
		self.api_client.force_authenticate(self.client_user)

		response = self.api_client.patch(
			f"/api/jobs/{self.job.id}/",
			{"status": "Completed"},
			format="json",
		)

		self.assertEqual(response.status_code, 400)
		self.job.refresh_from_db()
		self.assertEqual(self.job.status, "Open")

	def test_freelancer_cannot_complete_job(self):
		self.job.status = "In Progress"
		self.job.save(update_fields=["status"])
		self.api_client.force_authenticate(self.first_freelancer)

		response = self.api_client.patch(
			f"/api/jobs/{self.job.id}/",
			{"status": "Completed"},
			format="json",
		)

		self.assertEqual(response.status_code, 403)

	def test_other_client_cannot_complete_job(self):
		self.job.status = "In Progress"
		self.job.save(update_fields=["status"])
		self.api_client.force_authenticate(self.other_client)

		response = self.api_client.patch(
			f"/api/jobs/{self.job.id}/",
			{"status": "Completed"},
			format="json",
		)

		self.assertEqual(response.status_code, 403)

	def test_completed_job_cannot_be_completed_again(self):
		self.job.status = "Completed"
		self.job.save(update_fields=["status"])
		self.api_client.force_authenticate(self.client_user)

		response = self.api_client.patch(
			f"/api/jobs/{self.job.id}/",
			{"status": "Completed"},
			format="json",
		)

		self.assertEqual(response.status_code, 400)

	def test_freelancer_cannot_change_application_status(self):
		self.api_client.force_authenticate(self.first_freelancer)

		response = self.api_client.patch(
			f"/api/applications/{self.first_application.id}/",
			{"status": "Accepted"},
			format="json",
		)

		self.assertEqual(response.status_code, 400)
		self.first_application.refresh_from_db()
		self.assertEqual(self.first_application.status, "Pending")

	def test_other_freelancer_cannot_view_application_detail(self):
		self.api_client.force_authenticate(self.second_freelancer)

		response = self.api_client.get(
			f"/api/applications/{self.first_application.id}/"
		)

		self.assertEqual(response.status_code, 403)

from decimal import Decimal

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import Profile
from .models import Job


class JobWorkflowTests(TestCase):

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

		self.freelancer = User.objects.create_user(
			username="freelancer",
			password="password",
		)
		Profile.objects.create(user=self.freelancer, role="freelancer")

		self.jobs = [
			Job.objects.create(
				client=self.client_user,
				title=f"Job {status}",
				description="Project description",
				category="Web Development",
				budget=Decimal("1000.00"),
				deadline="2030-01-01",
				status=status,
			)
			for status in ("Open", "In Progress", "Completed")
		]
		Job.objects.create(
			client=self.other_client,
			title="Other client's job",
			description="Other project",
			category="Writing",
			budget=Decimal("500.00"),
			deadline="2030-01-01",
		)
		self.api_client = APIClient()

	def test_client_can_see_all_owned_jobs_in_my_jobs(self):
		self.api_client.force_authenticate(self.client_user)

		response = self.api_client.get("/api/jobs/my-jobs/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data), 3)
		self.assertEqual(
			{job["client"] for job in response.data},
			{self.client_user.username},
		)

	def test_client_cannot_see_other_clients_jobs_in_my_jobs(self):
		self.api_client.force_authenticate(self.other_client)

		response = self.api_client.get("/api/jobs/my-jobs/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]["client"], "other-client")

	def test_freelancer_cannot_access_my_jobs(self):
		self.api_client.force_authenticate(self.freelancer)

		response = self.api_client.get("/api/jobs/my-jobs/")

		self.assertEqual(response.status_code, 403)

	def test_marketplace_only_returns_open_jobs(self):
		self.api_client.force_authenticate(self.freelancer)

		response = self.api_client.get("/api/jobs/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(
			{job["status"] for job in response.data},
			{"Open"},
		)

# Create your tests here.

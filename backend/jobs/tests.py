from decimal import Decimal

from django.contrib.auth.models import User
from django.test import TestCase
from rest_framework.test import APIClient

from accounts.models import Profile
from .models import Job, SavedJob


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
		jobs = response.data["results"]
		self.assertEqual(
			{job["status"] for job in jobs},
			{"Open"},
		)

	def test_marketplace_filters_jobs(self):
		self.api_client.force_authenticate(self.freelancer)

		response = self.api_client.get(
			"/api/jobs/",
			{
				"search": "other client's",
				"category": "Writing",
				"min_budget": "400",
				"max_budget": "600",
				"status": "Open",
			},
		)

		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data["results"]), 1)
		self.assertEqual(response.data["results"][0]["title"], "Other client's job")

	def test_marketplace_paginates_open_jobs(self):
		for job_number in range(11):
			Job.objects.create(
				client=self.client_user,
				title=f"Additional job {job_number}",
				description="Additional project",
				category="Web Development",
				budget=Decimal("800.00"),
				deadline="2030-01-01",
			)

		response = self.api_client.get("/api/jobs/")

		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["count"], 13)
		self.assertEqual(len(response.data["results"]), 10)
		self.assertIsNotNone(response.data["next"])

	def test_invalid_budget_filter_returns_bad_request(self):
		response = self.api_client.get("/api/jobs/", {"min_budget": "not-a-number"})

		self.assertEqual(response.status_code, 400)
		self.assertIn("min_budget", response.data)


class SavedJobAPITests(TestCase):
	def setUp(self):
		self.api = APIClient()
		self.client_user = User.objects.create_user(username="client1", password="password")
		Profile.objects.create(user=self.client_user, role="client")

		self.freelancer1 = User.objects.create_user(username="freelancer1", password="password")
		Profile.objects.create(user=self.freelancer1, role="freelancer")

		self.freelancer2 = User.objects.create_user(username="freelancer2", password="password")
		Profile.objects.create(user=self.freelancer2, role="freelancer")

		self.job1 = Job.objects.create(
			client=self.client_user,
			title="Web App Development",
			description="React & Django job",
			category="Web Development",
			budget=Decimal("1200.00"),
			deadline="2030-01-01",
			status="Open",
		)
		self.job2 = Job.objects.create(
			client=self.client_user,
			title="Mobile App Development",
			description="Flutter app",
			category="Mobile Development",
			budget=Decimal("1500.00"),
			deadline="2030-02-01",
			status="Open",
		)

	def test_unauthenticated_user_cannot_access_saved_jobs(self):
		self.assertEqual(self.api.get("/api/jobs/saved/").status_code, 401)
		self.assertEqual(self.api.post(f"/api/jobs/{self.job1.id}/save/").status_code, 401)
		self.assertEqual(self.api.delete(f"/api/jobs/{self.job1.id}/save/").status_code, 401)

	def test_save_job_success(self):
		self.api.force_authenticate(self.freelancer1)
		response = self.api.post(f"/api/jobs/{self.job1.id}/save/")

		self.assertEqual(response.status_code, 201, response.data)
		self.assertEqual(response.data["job_id"], self.job1.id)
		self.assertEqual(response.data["user"], "freelancer1")
		self.assertTrue(SavedJob.objects.filter(user=self.freelancer1, job=self.job1).exists())

	def test_duplicate_save_prevented(self):
		self.api.force_authenticate(self.freelancer1)
		# First save -> 201
		self.api.post(f"/api/jobs/{self.job1.id}/save/")

		# Second save -> 400
		response = self.api.post(f"/api/jobs/{self.job1.id}/save/")
		self.assertEqual(response.status_code, 400)
		self.assertIn("already saved", str(response.data))

	def test_remove_saved_job(self):
		self.api.force_authenticate(self.freelancer1)
		SavedJob.objects.create(user=self.freelancer1, job=self.job1)

		response = self.api.delete(f"/api/jobs/{self.job1.id}/save/")
		self.assertEqual(response.status_code, 204)
		self.assertFalse(SavedJob.objects.filter(user=self.freelancer1, job=self.job1).exists())

		# Deleting again returns 404
		response_again = self.api.delete(f"/api/jobs/{self.job1.id}/save/")
		self.assertEqual(response_again.status_code, 404)

	def test_list_saved_jobs(self):
		self.api.force_authenticate(self.freelancer1)
		SavedJob.objects.create(user=self.freelancer1, job=self.job1)
		SavedJob.objects.create(user=self.freelancer1, job=self.job2)

		response = self.api.get("/api/jobs/saved/")
		self.assertEqual(response.status_code, 200)
		self.assertEqual(len(response.data), 2)
		saved_job_ids = {item["job_id"] for item in response.data}
		self.assertEqual(saved_job_ids, {self.job1.id, self.job2.id})

	def test_user_data_isolation(self):
		# Freelancer 1 saves job 1
		SavedJob.objects.create(user=self.freelancer1, job=self.job1)
		# Freelancer 2 saves job 2
		SavedJob.objects.create(user=self.freelancer2, job=self.job2)

		# Freelancer 1 list only sees job 1
		self.api.force_authenticate(self.freelancer1)
		res1 = self.api.get("/api/jobs/saved/")
		self.assertEqual(len(res1.data), 1)
		self.assertEqual(res1.data[0]["job_id"], self.job1.id)

		# Freelancer 2 cannot delete Freelancer 1's saved job 1
		self.api.force_authenticate(self.freelancer2)
		del_res = self.api.delete(f"/api/jobs/{self.job1.id}/save/")
		self.assertEqual(del_res.status_code, 404)

	def test_save_nonexistent_job_returns_404(self):
		self.api.force_authenticate(self.freelancer1)
		response = self.api.post("/api/jobs/99999/save/")
		self.assertEqual(response.status_code, 404)


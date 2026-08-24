from django.db import models
from django.contrib.auth.models import User

from jobs.models import Job


class Application(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
    ]

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    freelancer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="job_applications",
    )

    proposal = models.TextField()

    bid_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["job", "freelancer"],
                name="unique_job_freelancer_application",
            )
        ]

        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.freelancer.username} - {self.job.title}"
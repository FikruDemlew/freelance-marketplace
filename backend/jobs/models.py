from django.db import models
from django.contrib.auth.models import User


class Job(models.Model):

    CATEGORY_CHOICES = [
        ("Web Development", "Web Development"),
        ("Mobile Development", "Mobile Development"),
        ("UI/UX Design", "UI/UX Design"),
        ("Graphics Design", "Graphics Design"),
        ("Writing", "Writing"),
        ("Video Editing", "Video Editing"),
        ("Music Production", "Music Production"),
        ("Admin & Virtual Assistance", "Admin & Virtual Assistance"),
        ("Sales & Lead Generation", "Sales & Lead Generation"),
        ("Data & Analytics", "Data & Analytics"),
        ("Data Science", "Data Science"),
        ("Engineering & Architecture", "Engineering & Architecture"),
        ("Business Consulting & Strategy", "Business Consulting & Strategy"),
        ("Other", "Other"),
    ]

    STATUS_CHOICES = [
        ("Open", "Open"),
        ("In Progress", "In Progress"),
        ("Completed", "Completed"),
        ("Closed", "Closed"),
    ]

    client = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="jobs"
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    budget = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    deadline = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Open"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title


class SavedJob(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="saved_jobs"
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="saved_by_users"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "job"],
                name="unique_user_saved_job"
            )
        ]
        indexes = [
            models.Index(fields=["user", "created_at"]),
        ]

    def __str__(self):
        return f"{self.user.username} saved {self.job.title}"
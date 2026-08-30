from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("job", "reviewer", "freelancer", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("job__title", "reviewer__username", "freelancer__username")

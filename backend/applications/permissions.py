from rest_framework import permissions


class IsApplicationParticipant(permissions.BasePermission):
    """
    - View (GET): Freelancer who applied or Client who owns the job.
    - Edit (PUT/PATCH): Only the freelancer who submitted the application.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.freelancer == request.user or obj.job.client == request.user
        
        return obj.freelancer == request.user
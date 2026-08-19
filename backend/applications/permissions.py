from rest_framework import permissions


class IsApplicationParticipant(permissions.BasePermission):
    """
    Allows access only to the freelancer who applied or the client who owns the job.
    """
    def has_object_permission(self, request, view, obj):
        return obj.freelancer == request.user or obj.job.client == request.user
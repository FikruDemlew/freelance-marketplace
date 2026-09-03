from rest_framework import permissions


class IsApplicationOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        if request.method in permissions.SAFE_METHODS:
            return (
                obj.freelancer == request.user
                or obj.job.client == request.user
            )

        return (
            obj.freelancer == request.user
            or obj.job.client == request.user
        )
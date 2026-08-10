from rest_framework import permissions


class IsJobOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(
        self,
        request,
        view,
        obj
    ):

        # Anyone can view a job
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only the client who created the job
        # can modify or delete it
        return obj.client == request.user
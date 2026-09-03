from rest_framework import permissions


class IsClient(permissions.BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and hasattr(request.user, "profile")
            and request.user.profile.role == "client"
        )


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
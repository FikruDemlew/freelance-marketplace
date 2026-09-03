from rest_framework import permissions


class IsFreelancer(permissions.BasePermission):
    message = "Only freelancers can access the freelancer dashboard."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "profile")
            and request.user.profile.role == "freelancer"
        )


class IsClient(permissions.BasePermission):
    message = "Only clients can access the client dashboard."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and hasattr(request.user, "profile")
            and request.user.profile.role == "client"
        )

from rest_framework import permissions


class IsApplicationOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):

        # Anyone authenticated can view an application
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only the freelancer who submitted the application
        # can modify or delete it
        return obj.freelancer == request.user
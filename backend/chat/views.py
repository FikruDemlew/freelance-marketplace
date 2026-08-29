from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from applications.models import Application


class ConversationListCreateAPIView(generics.ListCreateAPIView):

    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        return Conversation.objects.filter(
            client=user
        ) | Conversation.objects.filter(
            freelancer=user
        )

    def perform_create(self, serializer):

        application_id = self.request.data.get("application")

        try:
            application = Application.objects.get(
                id=application_id
            )
        except Application.DoesNotExist:
            raise PermissionDenied(
                "Application does not exist."
            )

        user = self.request.user

        # Only the client or freelancer involved
        # in the application can create a conversation.
        if (
            application.job.client_id != user.id
            and application.freelancer_id != user.id
        ):
            raise PermissionDenied(
                "You are not part of this application."
            )

        # Make sure the conversation does not already exist.
        if Conversation.objects.filter(
            application=application
        ).exists():
            raise PermissionDenied(
                "A conversation already exists for this application."
            )

        serializer.save(
            application=application,
            client=application.job.client,
            freelancer=application.freelancer,
        )


class MessageListCreateAPIView(generics.ListCreateAPIView):

    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        conversation_id = self.kwargs["conversation_id"]

        return Message.objects.filter(
            conversation_id=conversation_id
        ).filter(
            conversation__client=self.request.user
        ) | Message.objects.filter(
            conversation_id=conversation_id
        ).filter(
            conversation__freelancer=self.request.user
        )

    def perform_create(self, serializer):

        conversation_id = self.kwargs["conversation_id"]

        try:
            conversation = Conversation.objects.get(
                id=conversation_id
            )
        except Conversation.DoesNotExist:
            raise PermissionDenied(
                "Conversation does not exist."
            )

        user = self.request.user

        # Only participants can send messages.
        if (
            conversation.client_id != user.id
            and conversation.freelancer_id != user.id
        ):
            raise PermissionDenied(
                "You are not part of this conversation."
            )

        # Get the application connected to this conversation.
        application = conversation.application

        # Messaging is allowed only after the application is accepted.
        if application.status != "Accepted":
            raise PermissionDenied(
                "Messaging is available only for accepted applications."
            )

        serializer.save(
            conversation=conversation,
            sender=user,
        )
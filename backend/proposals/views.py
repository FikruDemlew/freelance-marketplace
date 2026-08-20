from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Proposal
from .serializers import ProposalSerializer


class ProposalCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        if not hasattr(request.user, "profile"):
            return Response(
                {"error": "User profile not found."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if request.user.profile.role != "freelancer":
            return Response(
                {"error": "Only freelancers can submit proposals."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ProposalSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(
                freelancer=request.user
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class MyProposalsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        proposals = Proposal.objects.filter(
            freelancer=request.user
        ).order_by("-created_at")

        serializer = ProposalSerializer(
            proposals,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
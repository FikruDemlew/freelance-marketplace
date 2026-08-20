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

        job_id = request.data.get("job")

        if Proposal.objects.filter(
            job_id=job_id,
            freelancer=request.user
        ).exists():
            return Response(
                {
                    "error": "You have already submitted a proposal for this job."
                },
                status=status.HTTP_400_BAD_REQUEST
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




class JobProposalsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, job_id):

        if not hasattr(request.user, "profile"):
            return Response(
                {"error": "User profile not found."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if request.user.profile.role != "client":
            return Response(
                {"error": "Only clients can view job proposals."},
                status=status.HTTP_403_FORBIDDEN
            )

        proposals = Proposal.objects.filter(
            job_id=job_id,
            job__client=request.user
        ).order_by("-created_at")

        serializer = ProposalSerializer(
            proposals,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )    

class ProposalStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, proposal_id):

        if not hasattr(request.user, "profile"):
            return Response(
                {"error": "User profile not found."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if request.user.profile.role != "client":
            return Response(
                {"error": "Only clients can update proposal status."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            proposal = Proposal.objects.get(
                id=proposal_id,
                job__client=request.user
            )
        except Proposal.DoesNotExist:
            return Response(
                {"error": "Proposal not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get("status")

        if new_status not in ["Accepted", "Rejected"]:
            return Response(
                {
                    "error": "Status must be either Accepted or Rejected."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        proposal.status = new_status
        proposal.save()

        serializer = ProposalSerializer(proposal)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )    
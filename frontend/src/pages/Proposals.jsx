import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Proposals() {
    const { id } = useParams();

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchProposals = async () => {
        try {
            const response = await api.get(
                `/proposals/job/${id}/`
            );

            setProposals(response.data);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.error ||
                "Failed to load proposals."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, [id]);

    const handleStatusChange = async (proposalId, newStatus) => {
        const confirmed = window.confirm(
            `Are you sure you want to ${newStatus.toLowerCase()} this proposal?`
        );

        if (!confirmed) {
            return;
        }

        setUpdatingId(proposalId);
        setError(null);

        try {
            const response = await api.patch(
                `/proposals/${proposalId}/status/`,
                {
                    status: newStatus,
                }
            );

            setProposals((currentProposals) =>
                currentProposals.map((proposal) => {
                    if (proposal.id === proposalId) {
                        return response.data;
                    }

                    if (
                        newStatus === "Accepted" &&
                        proposal.status === "Pending"
                    ) {
                        return {
                            ...proposal,
                            status: "Rejected",
                        };
                    }

                    return proposal;
                })
            );

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.error ||
                "Failed to update proposal."
            );

        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="mx-auto max-w-[1100px] px-6 py-20 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading proposals...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-[1100px] px-6 py-12">

                <div>
                    <p className="text-sm font-semibold text-gray-500">
                        Job #{id}
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-950">
                        Proposals
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Review freelancers who applied to your job.
                    </p>
                </div>


                {error && (
                    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                        {error}
                    </div>
                )}


                {!error && proposals.length === 0 && (
                    <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-10 text-center">
                        <h2 className="text-xl font-bold text-gray-900">
                            No proposals yet
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Freelancers have not submitted any proposals
                            for this job yet.
                        </p>
                    </div>
                )}


                <div className="mt-8 space-y-5">

                    {proposals.map((proposal) => (

                        <div
                            key={proposal.id}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                        >

                            <div className="flex flex-col justify-between gap-5 sm:flex-row">

                                <div>
                                    <p className="text-lg font-bold text-gray-950">
                                        {proposal.freelancer}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Submitted proposal #{proposal.id}
                                    </p>
                                </div>


                                <div className="text-left sm:text-right">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Bid
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-gray-950">
                                        ${proposal.bid_amount}
                                    </p>
                                </div>

                            </div>


                            <div className="mt-6 rounded-xl bg-gray-50 p-5">

                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Cover Letter
                                </p>

                                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-700">
                                    {proposal.cover_letter}
                                </p>

                            </div>


                            <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                                <div>
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                            proposal.status === "Accepted"
                                                ? "bg-green-100 text-green-700"
                                                : proposal.status === "Rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {proposal.status}
                                    </span>
                                </div>


                                {proposal.status === "Pending" && (

                                    <div className="flex gap-3">

                                        <button
                                            type="button"
                                            disabled={updatingId === proposal.id}
                                            onClick={() =>
                                                handleStatusChange(
                                                    proposal.id,
                                                    "Rejected"
                                                )
                                            }
                                            className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                        >
                                            Reject
                                        </button>


                                        <button
                                            type="button"
                                            disabled={updatingId === proposal.id}
                                            onClick={() =>
                                                handleStatusChange(
                                                    proposal.id,
                                                    "Accepted"
                                                )
                                            }
                                            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                                        >
                                            {updatingId === proposal.id
                                                ? "Updating..."
                                                : "Accept"}
                                        </button>

                                    </div>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            </main>
        </div>
    );
}

export default Proposals;
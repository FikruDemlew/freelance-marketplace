import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function MyProposals() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await api.get("/proposals/");

                setProposals(response.data);
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.error ||
                    "Failed to load your proposals."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="mx-auto max-w-[1100px] px-6 py-20 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading your proposals...
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
                        Freelancer Dashboard
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-gray-950">
                        My Proposals
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Track the proposals you have submitted.
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
                            You have not submitted any proposals yet.
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
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Job
                                    </p>

                                    <h2 className="mt-1 text-xl font-bold text-gray-950">
                                        {proposal.job_title}
                                    </h2>
                                </div>


                                <div className="text-left sm:text-right">

                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                        Your Bid
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
                                    <p className="text-xs text-gray-400">
                                        Submitted
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-700">
                                        {new Date(
                                            proposal.created_at
                                        ).toLocaleDateString()}
                                    </p>
                                </div>


                                <span
                                    className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold ${
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

                        </div>

                    ))}

                </div>

            </main>
        </div>
    );
}

export default MyProposals;
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function SubmitProposal() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [coverLetter, setCoverLetter] = useState("");
    const [bidAmount, setBidAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post("/proposals/create/", {
                job: id,
                cover_letter: coverLetter,
                bid_amount: bidAmount,
            });

            navigate(`/jobs/${id}`);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.error ||
                "Failed to submit proposal."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-[900px] px-6 py-12 lg:px-10">

                <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">

                    <h1 className="text-3xl font-bold text-gray-950">
                        Submit a Proposal
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Tell the client why you are the right freelancer
                        for this project.
                    </p>

                    {error && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6"
                    >

                        {/* Cover Letter */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900">
                                Cover Letter
                            </label>

                            <textarea
                                value={coverLetter}
                                onChange={(e) =>
                                    setCoverLetter(e.target.value)
                                }
                                required
                                rows={8}
                                placeholder="Explain your experience and how you would complete this project..."
                                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            />
                        </div>

                        {/* Bid Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900">
                                Your Bid Amount ($)
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={bidAmount}
                                onChange={(e) =>
                                    setBidAmount(e.target.value)
                                }
                                required
                                placeholder="550.00"
                                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">

                            <button
                                type="button"
                                onClick={() => navigate(`/jobs/${id}`)}
                                className="flex-1 rounded-xl border border-gray-300 px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Proposal"}
                            </button>

                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}

export default SubmitProposal;
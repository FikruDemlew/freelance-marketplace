import { useEffect, useState } from "react";
import {
    createApplication,
    updateApplication,
} from "../services/application";


function ApplyModal({
    jobId,
    jobTitle,
    existingApplication,
    onClose,
    onSuccess,
}) {
    const [proposal, setProposal] = useState("");
    const [bidAmount, setBidAmount] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (existingApplication) {
            setProposal(existingApplication.proposal || "");
            setBidAmount(existingApplication.bid_amount || "");
        } else {
            setProposal("");
            setBidAmount("");
        }
    }, [existingApplication]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            if (existingApplication) {
                await updateApplication(
                    existingApplication.id,
                    {
                        proposal,
                        bid_amount: bidAmount,
                    }
                );
            } else {
                await createApplication({
                    job: jobId,
                    proposal,
                    bid_amount: bidAmount,
                });
            }

            await onSuccess();
            onClose();
        } catch (error) {
            console.error(error);

            const data = error.response?.data;

            if (data?.job?.[0]) {
                setError(data.job[0]);
            } else if (data?.proposal?.[0]) {
                setError(data.proposal[0]);
            } else if (data?.bid_amount?.[0]) {
                setError(data.bid_amount[0]);
            } else if (data?.detail) {
                setError(data.detail);
            } else {
                setError("Failed to save application.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                    {existingApplication
                        ? "Edit Application"
                        : "Apply for Job"}
                </h2>

                <p className="mb-6 text-sm text-gray-500">
                    {jobTitle}
                </p>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Bid Amount
                        </label>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={bidAmount}
                            onChange={(event) =>
                                setBidAmount(event.target.value)
                            }
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                            placeholder="Enter your bid"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Proposal
                        </label>

                        <textarea
                            required
                            rows={6}
                            value={proposal}
                            onChange={(event) =>
                                setProposal(event.target.value)
                            }
                            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-black"
                            placeholder="Write your proposal..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Saving..."
                                : existingApplication
                                ? "Update Application"
                                : "Submit Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ApplyModal;
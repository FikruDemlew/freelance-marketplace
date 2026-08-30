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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
            <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl">

                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="font-display text-xl font-bold text-text-main">
                            {existingApplication ? "Edit Application" : "Apply for Job"}
                        </h2>
                        <p className="mt-1 line-clamp-1 text-sm text-text-muted">
                            {jobTitle}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-primary/40 hover:text-text-main"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-text-main">
                            Bid Amount <span className="text-text-muted font-normal">(USD)</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">$</span>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={bidAmount}
                                onChange={(event) => setBidAmount(event.target.value)}
                                className="field pl-9"
                                placeholder="500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-text-main">
                            Proposal
                        </label>
                        <textarea
                            required
                            rows={6}
                            value={proposal}
                            onChange={(event) => setProposal(event.target.value)}
                            className="field resize-none"
                            placeholder="Write your proposal — mention the client's goal, share one relevant outcome, then be clear about your next step..."
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-muted transition-all duration-200 hover:border-primary/30 hover:text-text-main"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
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
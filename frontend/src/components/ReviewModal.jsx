import { useState } from "react";

import { createReview } from "../services/review";


function ReviewModal({ jobId, onClose, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!rating) {
            setError("Please select a rating.");
            return;
        }

        setSubmitting(true);
        try {
            const review = await createReview({ job: jobId, rating, comment });
            onSuccess(review);
            onClose();
        } catch (requestError) {
            const data = requestError.response?.data;
            const message = typeof data === "string"
                ? data
                : Object.values(data || {}).flat().join(" ");
            setError(message || "Unable to submit your review.");
        } finally {
            setSubmitting(false);
        }
    };

    const displayRating = hovered || rating;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl sm:p-8"
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="font-display text-xl font-bold text-text-main">Leave a Review</h2>
                        <p className="mt-1 text-sm text-text-muted">
                            Share how working with this freelancer went.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close review form"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-primary/40 hover:text-text-main"
                    >
                        ×
                    </button>
                </div>

                {/* Stars */}
                <fieldset className="mt-7">
                    <legend className="mb-3 text-sm font-semibold text-text-main">Rating</legend>
                    <div className="flex gap-1" aria-label="Select a rating from 1 to 5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHovered(star)}
                                onMouseLeave={() => setHovered(0)}
                                aria-label={`${star} star${star === 1 ? "" : "s"}`}
                                className={`text-4xl leading-none transition-all duration-150 hover:scale-110 ${
                                    star <= displayRating ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]" : "text-text-subtle"
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    {displayRating > 0 && (
                        <p className="mt-2 text-xs text-text-muted">
                            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][displayRating]}
                        </p>
                    )}
                </fieldset>

                {/* Comment */}
                <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold text-text-main">
                        Comment
                    </label>
                    <textarea
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        maxLength={1000}
                        required
                        rows={5}
                        className="field resize-none"
                        placeholder="Great communication and delivered on time..."
                    />
                    <span className="mt-1 block text-right text-xs text-text-muted">
                        {comment.length}/1000
                    </span>
                </div>

                {error && (
                    <p className="mt-3 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-400">{error}</p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={onClose}
                        className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text-muted transition-all duration-200 hover:border-primary/30 hover:text-text-main disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ReviewModal;

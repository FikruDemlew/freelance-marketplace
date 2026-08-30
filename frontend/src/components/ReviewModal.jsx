import { useState } from "react";

import { createReview } from "../services/review";


function ReviewModal({ jobId, onClose, onSuccess }) {
    const [rating, setRating] = useState(0);
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-950">Leave a Review</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Share how working with this freelancer went.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close review form"
                        className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                    >
                        ×
                    </button>
                </div>

                <fieldset className="mt-7">
                    <legend className="text-sm font-semibold text-gray-900">Rating</legend>
                    <div className="mt-2 flex gap-1" aria-label="Select a rating from 1 to 5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                aria-label={`${star} star${star === 1 ? "" : "s"}`}
                                className={`text-4xl leading-none transition ${
                                    star <= rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </fieldset>

                <label className="mt-6 block text-sm font-semibold text-gray-900">
                    Comment
                    <textarea
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        maxLength={1000}
                        required
                        rows={5}
                        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                        placeholder="Great communication and delivered on time."
                    />
                    <span className="mt-1 block text-right text-xs font-normal text-gray-400">
                        {comment.length}/1000
                    </span>
                </label>

                {error && (
                    <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        disabled={submitting}
                        onClick={onClose}
                        className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ReviewModal;

import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ApplyModal from "../components/ApplyModal";
import ReviewModal from "../components/ReviewModal";
import {
    getApplications,
    updateApplicationStatus,
} from "../services/application";
import {
    getConversations,
    createConversation,
} from "../services/chat";
import { getReviews } from "../services/review";
import { useSavedJobs } from "../hooks/useSavedJobs";

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const {
        isJobSaved,
        isJobPending,
        toggleSavedJob,
    } = useSavedJobs(user, authLoading);

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [existingApplication, setExistingApplication] = useState(null);
    const [jobApplications, setJobApplications] = useState([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    const [statusUpdating, setStatusUpdating] = useState(null);
    const [completionUpdating, setCompletionUpdating] = useState(false);
    const [success, setSuccess] = useState("");
    const [review, setReview] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const handleOpenConversation = async () => {
        if (!existingApplication) return;

        try {
            const conversations = await getConversations();

            const existingConversation = conversations.find(
                (conversation) =>
                    Number(conversation.application) ===
                    Number(existingApplication.id)
            );

            if (existingConversation) {
                navigate(`/chat/${existingConversation.id}`);
                return;
            }

            const newConversation = await createConversation(
                existingApplication.id
            );

            navigate(`/chat/${newConversation.id}`);
        } catch (error) {
            console.error("Failed to open conversation:", error);
            setError(
                error.response?.data?.detail ||
                    "Failed to open conversation."
            );
        }
    };

    // 1. Fetch Job Data
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}/`);
                setJob(response.data);
            } catch (error) {
                console.error(error);
                setError("Failed to load job.");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const fetchJobReview = useCallback(async () => {
        if (!job) return;

        setReviewLoading(true);
        try {
            const reviews = await getReviews({ job: job.id });
            setReview(reviews[0] || null);
        } catch (requestError) {
            console.error("Failed to load review:", requestError);
            setReview(null);
        } finally {
            setReviewLoading(false);
        }
    }, [job]);

    // 2. Fetch Application Status (Only runs AFTER job is loaded)
    const fetchUserApplications = useCallback(async () => {
        if (!user || user.role !== "freelancer" || !job) {
            setExistingApplication(null);
            return;
        }

        try {
            const applications = await getApplications();

            const match = applications.find(
                (application) =>
                    Number(application.job) === Number(job.id) &&
                    Number(application.freelancer_id) === Number(user.id)
            );

            setExistingApplication(match || null);
        } catch (error) {
            console.error("Failed to check application status:", error);
            setExistingApplication(null);
        }
    }, [job, user]);

    const fetchJobApplications = useCallback(async () => {
        if (!user || user.role !== "client" || !job) {
            setJobApplications([]);
            return;
        }

        setApplicationsLoading(true);

        try {
            const applications = await getApplications();

            const applicationsForThisJob = applications.filter(
                (application) => Number(application.job) === Number(job.id)
            );

            setJobApplications(applicationsForThisJob);
        } catch (error) {
            console.error("Failed to fetch job applications:", error);
            setJobApplications([]);
        } finally {
            setApplicationsLoading(false);
        }
    }, [job, user]);

    const handleApplicationStatus = async (applicationId, status) => {
        setStatusUpdating(applicationId);
        setError(null);
        setSuccess("");

        try {
            await updateApplicationStatus(applicationId, status);
            await fetchJobApplications();
        } catch (error) {
            setError(error.response?.data?.detail || "Failed to update application status.");
        } finally {
            setStatusUpdating(null);
        }
    };

    const handleCompleteJob = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to mark this job as completed?"
        );

        if (!confirmed) return;

        setCompletionUpdating(true);
        setError(null);
        setSuccess("");

        try {
            const response = await api.patch(`/jobs/${id}/`, {
                status: "Completed",
            });
            setJob(response.data);
            setSuccess("Job marked as completed.");
        } catch (error) {
            setError(
                error.response?.data?.status?.[0] ||
                    error.response?.data?.detail ||
                    "Failed to complete job."
            );
        } finally {
            setCompletionUpdating(false);
        }
    };

    useEffect(() => {
        if (!job || user?.role !== "client") return undefined;
        const timer = setTimeout(fetchJobApplications, 0);
        return () => clearTimeout(timer);
    }, [job, user, fetchJobApplications]);

    useEffect(() => {
        if (!job) return undefined;
        const timer = setTimeout(fetchJobReview, 0);
        return () => clearTimeout(timer);
    }, [job, fetchJobReview]);

    useEffect(() => {
        if (!job) return undefined;
        const timer = setTimeout(fetchUserApplications, 0);
        return () => clearTimeout(timer);
    }, [job, user, fetchUserApplications]);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/jobs/${id}/`);
            navigate("/jobs");
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.detail || "Failed to delete job.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                    <div className="spinner" />
                    <p className="text-sm text-text-muted">Loading project details…</p>
                </div>
            </div>
        );
    }

    if (error && !job) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="mx-auto max-w-[900px] px-6 py-20">
                    <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-8 text-center">
                        <h2 className="font-display text-xl font-bold text-red-400">
                            Something went wrong
                        </h2>
                        <p className="mt-2 text-sm text-red-300">
                            {typeof error === "string" ? error : JSON.stringify(error)}
                        </p>
                        <Link
                            to="/jobs"
                            className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover"
                        >
                            Back to Jobs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const jobClientUsername =
        typeof job?.client === "object" ? job?.client?.username : job?.client;

    const isOwner =
        user &&
        (user.username === jobClientUsername ||
            String(user.id) === String(job?.client));
    const canReview = user?.role === "client" && isOwner && job?.status === "Completed";

    const handleReviewSuccess = (createdReview) => {
        setReview(createdReview);
        setSuccess("Review submitted successfully.");
    };

    const statusBadgeClass = (status) => {
        if (status === "Completed")   return "badge-completed";
        if (status === "In Progress") return "badge-in-progress";
        if (status === "Open")        return "badge-open";
        return "badge-open";
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {(error || success) && (
                <div className="mx-auto max-w-[1200px] px-6 pt-6 lg:px-10">
                    <div className={`rounded-xl border p-4 text-sm ${
                        error
                            ? "border-red-500/25 bg-red-500/10 text-red-400"
                            : "border-primary/25 bg-primary/10 text-primary"
                    }`}>
                        {error || success}
                    </div>
                </div>
            )}

            {/* Dark Header Banner */}
            <section className="relative overflow-hidden border-b border-border bg-ink text-white">
                <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent" />

                <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10 lg:py-16">
                    <Link
                        to="/jobs"
                        className="inline-flex items-center text-xs font-semibold text-text-muted transition-colors hover:text-primary"
                    >
                        ← Back to Jobs
                    </Link>

                    <div className="mt-6 max-w-4xl">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                                {job.category}
                            </span>
                            <span className={`inline-flex h-6 items-center rounded-full px-3 text-[10px] font-bold uppercase tracking-wide ${statusBadgeClass(job.status)}`}>
                                {job.status}
                            </span>
                        </div>

                        <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                            {job.title}
                        </h1>

                        <div className="mt-5 flex items-center gap-2 text-sm text-text-muted">
                            <span>Posted by</span>
                            {job?.client_id ? (
                                <Link
                                    to={`/profile/${job.client_id}`}
                                    className="inline-flex items-center gap-1.5 font-semibold text-text-main hover:text-primary transition-colors"
                                >
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                                        {jobClientUsername?.slice(0, 1).toUpperCase() || "C"}
                                    </span>
                                    {jobClientUsername}
                                </Link>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 font-semibold text-text-main">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                                        {jobClientUsername?.slice(0, 1).toUpperCase() || "C"}
                                    </span>
                                    {jobClientUsername}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10 lg:py-14">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* LEFT: Description */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm sm:p-9">
                            <h2 className="font-display text-xl font-bold tracking-tight text-text-main sm:text-2xl">
                                About this project
                            </h2>
                            <div className="mt-5 border-t border-border pt-5">
                                <p className="whitespace-pre-line text-sm leading-7 text-text-muted sm:text-base sm:leading-8">
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm">
                            <h2 className="font-display text-lg font-bold text-text-main">
                                Project Status
                            </h2>
                            <div className="mt-4 flex items-center gap-3">
                                <span className={`inline-flex h-3 w-3 rounded-full ${
                                    job.status === "Completed" ? "bg-blue-400 shadow-[0_0_8px_rgba(147,197,253,0.8)]" :
                                    job.status === "In Progress" ? "bg-purple-400 shadow-[0_0_8px_rgba(196,181,253,0.8)]" :
                                    "bg-primary shadow-[0_0_8px_rgba(0,192,88,0.8)]"
                                }`} />
                                <span className="text-sm font-semibold capitalize text-text-main">
                                    {job.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Sidebar */}
                    <aside>
                        <div className="sticky top-6 rounded-3xl border border-border bg-surface p-7 shadow-lg">
                            <h2 className="font-display text-lg font-bold text-text-main">
                                Project Overview
                            </h2>

                            <div className="mt-6 border-b border-border pb-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                    Budget
                                </p>
                                <p className="mt-1.5 font-display text-3xl font-bold text-text-main">
                                    ${job.budget}
                                </p>
                                <p className="mt-0.5 text-xs text-text-muted">Fixed Price</p>
                            </div>

                            <div className="border-b border-border py-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                    Deadline
                                </p>
                                <p className="mt-1 text-sm font-semibold text-text-main">
                                    {job.deadline}
                                </p>
                            </div>

                            <div className="py-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                    Category
                                </p>
                                <p className="mt-1 text-sm font-semibold text-text-main">
                                    {job.category}
                                </p>
                            </div>

                            {user && (
                                <button
                                    type="button"
                                    onClick={() => toggleSavedJob(job.id)}
                                    disabled={isJobPending(job.id)}
                                    aria-label={isJobSaved(job.id) ? "Remove saved job" : "Save job"}
                                    aria-pressed={isJobSaved(job.id)}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${isJobSaved(job.id) ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-surface-hover text-text-main hover:border-primary/30 hover:text-primary"}`}
                                >
                                    <span aria-hidden="true">{isJobSaved(job.id) ? "♥" : "♡"}</span>
                                    {isJobSaved(job.id) ? "Saved Job" : "Save Job"}
                                </button>
                            )}

                            {/* Owner Actions */}
                            {isOwner && (
                                <div className="mt-6 border-t border-border pt-6 space-y-3">
                                    {job.status === "In Progress" && (
                                        <button
                                            type="button"
                                            disabled={completionUpdating}
                                            onClick={handleCompleteJob}
                                            className="flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.35)] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {completionUpdating
                                                ? "Updating..."
                                                : "Mark Job as Completed"}
                                        </button>
                                    )}
                                    {canReview && (
                                        reviewLoading ? (
                                            <div className="rounded-xl border border-border bg-surface-hover px-5 py-3 text-center text-xs font-semibold text-text-muted">
                                                Loading review...
                                            </div>
                                        ) : review ? (
                                            <div className="rounded-2xl border border-primary/25 bg-primary/10 p-4">
                                                <p className="text-xs font-bold uppercase tracking-wider text-primary">Review Submitted</p>
                                                <p className="mt-1.5 text-base tracking-wide text-yellow-400">
                                                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                                </p>
                                                <p className="mt-2 text-xs leading-5 text-text-muted">{review.comment}</p>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setIsReviewModalOpen(true)}
                                                className="flex w-full items-center justify-center rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-amber-300 hover:shadow-[0_0_16px_rgba(251,191,36,0.35)]"
                                            >
                                                ★ Leave a Review
                                            </button>
                                        )
                                    )}
                                    <Link
                                        to={`/jobs/${id}/edit`}
                                        className="flex w-full items-center justify-center rounded-xl border border-border bg-surface-hover px-5 py-3 text-sm font-semibold text-text-main transition-all duration-200 hover:border-primary/30 hover:text-primary"
                                    >
                                        Edit Job
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex w-full items-center justify-center rounded-xl border border-red-500/20 px-5 py-3 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/8"
                                    >
                                        Delete Job
                                    </button>
                                </div>
                            )}

                            {/* Freelancer Actions */}
                            {user && user.role === "freelancer" && (
                                <div className="mt-6 border-t border-border pt-6">
                                    {existingApplication ? (
                                        <div className="space-y-3">
                                            {/* Status Box */}
                                            <div
                                                className={`w-full text-center px-4 py-3 font-semibold text-xs rounded-xl ${
                                                    existingApplication.status === "Accepted"
                                                        ? "badge-accepted"
                                                        : existingApplication.status === "Rejected"
                                                        ? "badge-rejected"
                                                        : "badge-pending"
                                                }`}
                                            >
                                                {existingApplication.status === "Accepted"
                                                    ? "✓ Application Accepted"
                                                    : existingApplication.status === "Rejected"
                                                    ? "✕ Application Rejected"
                                                    : "⏳ Application Pending"}
                                            </div>

                                            {/* Edit Button */}
                                            {existingApplication.status !== "Accepted" && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsApplyModalOpen(true)}
                                                    className="w-full rounded-xl border border-border bg-surface-hover px-5 py-3 text-sm font-semibold text-text-main transition-all duration-200 hover:border-primary/30 hover:text-primary"
                                                >
                                                    Edit Application
                                                </button>
                                            )}

                                            {/* Message Client Button */}
                                            {existingApplication.status === "Accepted" && (
                                                <button
                                                    type="button"
                                                    onClick={handleOpenConversation}
                                                    className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.35)]"
                                                >
                                                    💬 Message Client
                                                </button>
                                            )}
                                        </div>
                                    ) : job.status === "Open" ? (
                                        <button
                                            type="button"
                                            onClick={() => setIsApplyModalOpen(true)}
                                            className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.35)]"
                                        >
                                            Apply for Job
                                        </button>
                                    ) : (
                                        <div className="rounded-xl border border-border bg-surface-hover px-4 py-3 text-center text-xs font-semibold text-text-muted">
                                            Applications are closed for this job.
                                        </div>
                                    )}
                                </div>
                            )}

                            {isApplyModalOpen && (
                                <ApplyModal
                                    jobId={job.id}
                                    jobTitle={job.title}
                                    existingApplication={existingApplication}
                                    onClose={() => setIsApplyModalOpen(false)}
                                    onSuccess={fetchUserApplications}
                                />
                            )}
                            {isReviewModalOpen && (
                                <ReviewModal
                                    jobId={job.id}
                                    onClose={() => setIsReviewModalOpen(false)}
                                    onSuccess={handleReviewSuccess}
                                />
                            )}
                        </div>
                    </aside>
                </div>

                {/* Applications Section for Client */}
                {user && user.role === "client" && (
                    <section id="applications" className="mt-12">
                        <div className="mb-6">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Applications</p>
                            <h2 className="mt-1 font-display text-2xl font-bold text-text-main">
                                Freelancers who applied
                            </h2>
                        </div>

                        {applicationsLoading ? (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface p-12 text-center">
                                <div className="spinner" />
                                <p className="mt-3 text-xs text-text-muted">Loading applications…</p>
                            </div>
                        ) : jobApplications.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-border bg-surface p-12 text-center">
                                <p className="text-sm text-text-muted">
                                    No applications submitted yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {jobApplications.map((application) => (
                                    <div
                                        key={application.id}
                                        className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
                                    >
                                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                            {application.freelancer_id ? (
                                                <Link
                                                    to={`/profile/${application.freelancer_id}`}
                                                    className="flex items-center gap-3 group/freelancer hover:text-primary transition-colors"
                                                >
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-bold text-primary ring-1 ring-primary/25 group-hover/freelancer:bg-primary/25">
                                                        {application.freelancer?.slice(0, 1).toUpperCase() || "F"}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-display text-base font-bold text-text-main group-hover/freelancer:text-primary transition-colors">
                                                            {application.freelancer}
                                                        </h3>
                                                        <p className="text-xs text-text-muted">
                                                            Applied on{" "}
                                                            {new Date(application.created_at).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-bold text-primary ring-1 ring-primary/25">
                                                        {application.freelancer?.slice(0, 1).toUpperCase() || "F"}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-display text-base font-bold text-text-main">
                                                            {application.freelancer}
                                                        </h3>
                                                        <p className="text-xs text-text-muted">
                                                            Applied on{" "}
                                                            {new Date(application.created_at).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <span className={`h-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                                                application.status === "Accepted" ? "badge-accepted" :
                                                application.status === "Rejected" ? "badge-rejected" :
                                                "badge-pending"
                                            }`}>
                                                {application.status}
                                            </span>
                                        </div>

                                        <div className="mt-5 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                                    Bid Amount
                                                </p>
                                                <p className="mt-1.5 text-xl font-bold text-text-main">
                                                    ${application.bid_amount}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">
                                                    Proposal
                                                </p>
                                                <p className="mt-1.5 text-sm leading-6 text-text-muted">
                                                    {application.proposal}
                                                </p>
                                            </div>
                                        </div>

                                        {application.status === "Pending" && (
                                            <div className="mt-5 flex gap-3 border-t border-border pt-5">
                                                <button
                                                    type="button"
                                                    disabled={statusUpdating === application.id}
                                                    onClick={() => handleApplicationStatus(application.id, "Accepted")}
                                                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_14px_rgba(0,192,88,0.3)] disabled:opacity-50"
                                                >
                                                    {statusUpdating === application.id ? "Updating..." : "Accept Proposal"}
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={statusUpdating === application.id}
                                                    onClick={() => handleApplicationStatus(application.id, "Rejected")}
                                                    className="rounded-xl border border-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/8 disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        {application.status === "Accepted" && (
                                            <div className="mt-5 border-t border-border pt-5">
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        try {
                                                            const conversations = await getConversations();

                                                            const existingConversation = conversations.find(
                                                                (conversation) =>
                                                                    Number(conversation.application) ===
                                                                    Number(application.id)
                                                            );

                                                            if (existingConversation) {
                                                                navigate(`/chat/${existingConversation.id}`);
                                                                return;
                                                            }

                                                            const newConversation = await createConversation(
                                                                application.id
                                                            );

                                                            navigate(`/chat/${newConversation.id}`);
                                                        } catch (error) {
                                                            console.error("Failed to open conversation:", error);
                                                            setError(
                                                                error.response?.data?.detail ||
                                                                "Failed to open conversation."
                                                            );
                                                        }
                                                    }}
                                                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_14px_rgba(0,192,88,0.3)]"
                                                >
                                                    💬 Message Freelancer
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}

export default JobDetails;

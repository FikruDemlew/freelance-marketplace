import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ApplyModal from "../components/ApplyModal";
import {
    getApplications,
    updateApplicationStatus,
} from "../services/application";

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

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

    // 2. Fetch Application Status (Only runs AFTER job is loaded)
const fetchUserApplications = async () => {
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
        console.error(
            "Failed to check application status:",
            error
        );

        setExistingApplication(null);
    }
};

const fetchJobApplications = async () => {
    if (!user || user.role !== "client" || !job) {
        setJobApplications([]);
        return;
    }

    setApplicationsLoading(true);

    try {
        const applications = await getApplications();

        const applicationsForThisJob = applications.filter(
            (application) =>
                Number(application.job) === Number(job.id)
        );

        setJobApplications(applicationsForThisJob);
    } catch (error) {
        console.error(
            "Failed to fetch job applications:",
            error
        );

        setJobApplications([]);
    } finally {
        setApplicationsLoading(false);
    }
};

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

    if (!confirmed) {
        return;
    }

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
    if (job && user?.role === "client") {
        fetchJobApplications();
    }
}, [job, user]);

    // Trigger application check when the job data changes
    useEffect(() => {
        if (job) {
            fetchUserApplications();
        }
    }, [job, user]);

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this job?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/jobs/${id}/`);
            navigate("/jobs");
        } catch (error) {
            console.error(error);
            setError(error.response?.data || "Failed to delete job.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="mx-auto max-w-[1100px] px-6 py-20 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                    <p className="mt-4 text-sm text-gray-500">Loading job...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="mx-auto max-w-[900px] px-6 py-20">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                        <h2 className="text-xl font-bold text-red-900">
                            Something went wrong
                        </h2>
                        <p className="mt-2 text-sm text-red-700">
                            {typeof error === "string"
                                ? error
                                : JSON.stringify(error)}
                        </p>
                        <Link
                            to="/jobs"
                            className="mt-6 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                            Back to Jobs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const jobClientUsername =
        typeof job.client === "object" ? job.client?.username : job.client;

    const isOwner =
        user &&
        (user.username === jobClientUsername ||
            String(user.id) === String(job.client));

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {(error || success) && (
                <div className="mx-auto max-w-[1200px] px-6 pt-6 lg:px-10">
                    <div className={`rounded-xl border p-4 text-sm ${
                        error
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-green-200 bg-green-50 text-green-700"
                    }`}>
                        {error || success}
                    </div>
                </div>
            )}

            {/* Dark Header */}
            <section className="bg-black text-white">
                <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
                    <Link
                        to="/jobs"
                        className="inline-flex items-center text-sm font-medium text-gray-400 transition hover:text-white"
                    >
                        ← Back to Jobs
                    </Link>

                    <div className="mt-10 max-w-4xl">
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-gray-300">
                            {job.category}
                        </span>

                        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            {job.title}
                        </h1>

                        <p className="mt-5 text-sm text-gray-400">
                            Posted by{" "}
                            <span className="font-semibold text-white">
                                {jobClientUsername}
                            </span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="mx-auto max-w-[1200px] px-6 py-12 lg:px-10 lg:py-16">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* LEFT: Description */}
                    <div className="lg:col-span-2">
                        <div className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                                About this project
                            </h2>
                            <div className="mt-6">
                                <p className="whitespace-pre-line text-base leading-8 text-gray-600">
                                    {job.description}
                                </p>
                            </div>
                        </div>

                        {/* Job Status */}
                        <div className="mt-6 rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
                            <h2 className="text-xl font-bold text-gray-950">
                                Project status
                            </h2>
                            <div className="mt-5 flex items-center gap-3">
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                <span className="text-sm font-semibold capitalize text-gray-700">
                                    {job.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Job Summary */}
                    <aside>
                        <div className="sticky top-6 rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-950">
                                Job details
                            </h2>

                            <div className="mt-7 border-b border-gray-100 pb-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Budget
                                </p>
                                <p className="mt-2 text-3xl font-bold text-gray-950">
                                    ${job.budget}
                                </p>
                            </div>

                            <div className="border-b border-gray-100 py-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Deadline
                                </p>
                                <p className="mt-2 text-base font-semibold text-gray-900">
                                    {job.deadline}
                                </p>
                            </div>

                            <div className="border-b border-gray-100 py-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Category
                                </p>
                                <p className="mt-2 text-base font-semibold text-gray-900">
                                    {job.category}
                                </p>
                            </div>

                            {/* Owner Actions */}
                            {isOwner && (
                                <div className="mt-7 space-y-3">
                                    {job.status === "In Progress" && (
                                        <button
                                            type="button"
                                            disabled={completionUpdating}
                                            onClick={handleCompleteJob}
                                            className="flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {completionUpdating
                                                ? "Updating..."
                                                : "Mark Job as Completed"}
                                        </button>
                                    )}
                                    <Link
                                        to={`/jobs/${id}/edit`}
                                        className="flex w-full items-center justify-center rounded-xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                                    >
                                        Edit Job
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex w-full items-center justify-center rounded-xl border border-red-200 px-5 py-3.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        Delete Job
                                    </button>
                                </div>
                            )}

                            {/* Freelancer Actions */}
                            {user && user.role === "freelancer" && (
                                <div className="mt-7">
                                    {existingApplication ? (
                                        <div className="space-y-3">
                                            <div className="w-full text-center px-4 py-2 bg-green-50 text-green-700 border border-green-200 font-medium text-sm rounded-xl">
                                                ✓ Already Applied (Status:{" "}
                                                {existingApplication.status})
                                            </div>
                                            <button
                                                onClick={() => setIsApplyModalOpen(true)}
                                                className="w-full rounded-xl bg-yellow-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-yellow-700"
                                            >
                                                Edit Application
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setIsApplyModalOpen(true)}
                                            className="w-full rounded-xl bg-green-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700"
                                        >
                                            Apply for Job
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Render Modal Overlay */}
                            {isApplyModalOpen && (
                                <ApplyModal
                                    jobId={job.id}
                                    jobTitle={job.title}
                                    existingApplication={existingApplication}
                                    onClose={() => setIsApplyModalOpen(false)}
                                    onSuccess={fetchUserApplications}
                                />
                            )}
                        </div>
                    </aside>
                </div>
                {user &&
                    user.role === "client" && (
                   
                        <section id="applications" className="mt-10">
                            <div className="mb-5">
                                <h2 className="text-2xl font-bold text-gray-950">
                                    Applications
                                </h2>
                    
                                <p className="mt-1 text-sm text-gray-500">
                                    Freelancers who applied to this job.
                                </p>
                            </div>
                    
                            {applicationsLoading ? (
                                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                                    <p className="text-sm text-gray-500">
                                        Loading applications...
                                    </p>
                                </div>
                            ) : jobApplications.length === 0 ? (
                                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                                    <p className="text-gray-600">
                                        No applications yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {jobApplications.map((application) => (
                                        <div
                                            key={application.id}
                                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                                        >
                                            <div className="flex flex-col justify-between gap-4 sm:flex-row">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-950">
                                                        {application.freelancer}
                                                    </h3>
                                    
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Applied on{" "}
                                                        {new Date(
                                                            application.created_at
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                    
                                                <span className={`h-fit rounded-full px-4 py-2 text-xs font-semibold ${
                                                    application.status === "Accepted"
                                                        ? "bg-green-50 text-green-700"
                                                        : application.status === "Rejected"
                                                        ? "bg-red-50 text-red-700"
                                                        : "bg-yellow-50 text-yellow-700"
                                                }`}>
                                                    {application.status}
                                                </span>
                                            </div>
                                                    
                                            <div className="mt-6 grid gap-6 border-t border-gray-100 pt-5 sm:grid-cols-2">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                        Bid Amount
                                                    </p>
                                                    
                                                    <p className="mt-2 text-xl font-bold text-gray-950">
                                                        ${application.bid_amount}
                                                    </p>
                                                </div>
                                                    
                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                                        Proposal
                                                    </p>
                                                    
                                                    <p className="mt-2 text-sm leading-6 text-gray-600">
                                                        {application.proposal}
                                                    </p>
                                                </div>
                                            </div>
                                                    
                            {application.status === "Pending" && (
                                <div className="mt-6 flex gap-3 border-t border-gray-100 pt-5">
                                    <button
                                        type="button"
                                        disabled={statusUpdating === application.id}
                                        onClick={() => handleApplicationStatus(application.id, "Accepted")}
                                        className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                                    >
                                        {statusUpdating === application.id ? "Updating..." : "Accept"}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={statusUpdating === application.id}
                                        onClick={() => handleApplicationStatus(application.id, "Rejected")}
                                        className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                                    >
                                        Reject
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
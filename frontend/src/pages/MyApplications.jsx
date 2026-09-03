import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getApplications, deleteApplication } from "../services/application";
import { useAuth } from "../context/useAuth";
import ApplyModal from "../components/ApplyModal";


function MyApplications() {

    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);

    const handleApplicationUpdated = async () => {
        const data = await getApplications();
        setApplications(data);
    };

    const handleDeleteApplication = async (applicationId) => {
        const confirmed = window.confirm("Are you sure you want to delete this application?");
        if (!confirmed) return;

        try {
            await deleteApplication(applicationId);
            setApplications((current) =>
                current.filter((app) => app.id !== applicationId)
            );
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.detail || "Failed to delete application.");
        }
    };

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getApplications();

                const myApplications = data.filter(
                    (application) =>
                        Number(application.freelancer_id) === Number(user.id)
                );
                setApplications(myApplications);
            } catch (error) {
                console.error(error);
                setError("Failed to load your applications.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchApplications();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                    <div className="spinner" />
                    <p className="text-sm text-text-muted">Loading applications…</p>
                </div>
            </div>
        );
    }

    const badgeClass = (status) => {
        if (status === "Accepted") return "badge-accepted";
        if (status === "Rejected") return "badge-rejected";
        return "badge-pending";
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="mx-auto max-w-[1100px] px-6 py-12 lg:px-10">

                {/* Page header */}
                <div className="mb-10">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        Freelancer dashboard
                    </p>
                    <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-text-main">
                        My Applications
                    </h1>
                    <p className="mt-2 text-sm text-text-muted">
                        Track the jobs you have applied for.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {error ? null : applications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface px-6 py-24 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-hover text-2xl">
                            📄
                        </div>
                        <h2 className="font-display text-xl font-bold text-text-main">
                            No applications yet
                        </h2>
                        <p className="mt-2 max-w-xs text-sm text-text-muted">
                            Find a job and submit your first application to get started.
                        </p>
                        <Link
                            to="/jobs"
                            className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover"
                        >
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((application) => (
                            <div
                                key={application.id}
                                className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-primary/25 hover:shadow-[0_4px_20px_rgba(0,192,88,0.07)]"
                            >
                                <div className="p-6 sm:p-7">

                                    {/* Top row */}
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div>
                                            <h2 className="font-display text-xl font-bold text-text-main">
                                                {application.job_title}
                                            </h2>
                                            <p className="mt-1 text-sm text-text-muted">
                                                Applied on{" "}
                                                {new Date(application.created_at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <span className={`h-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeClass(application.status)}`}>
                                            {application.status}
                                        </span>
                                    </div>

                                    {/* Details */}
                                    <div className="mt-6 grid gap-5 border-t border-border pt-5 sm:grid-cols-2">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">Your Bid</p>
                                            <p className="mt-1.5 text-xl font-bold text-text-main">${application.bid_amount}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">Proposal</p>
                                            <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-text-muted">
                                                {application.proposal}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-5">
                                        <Link
                                            to={`/jobs/${application.job}`}
                                            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_12px_rgba(0,192,88,0.28)]"
                                        >
                                            View Job
                                        </Link>

                                        <button
                                            onClick={() => setSelectedApplication(application)}
                                            className="rounded-xl border border-border bg-surface-hover px-5 py-2.5 text-sm font-semibold text-text-main transition-all duration-200 hover:border-primary/30 hover:text-primary"
                                        >
                                            Edit Application
                                        </button>

                                        <button
                                            onClick={() => handleDeleteApplication(application.id)}
                                            className="rounded-xl border border-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/8"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {selectedApplication && (
                <ApplyModal
                    jobId={selectedApplication.job}
                    jobTitle={selectedApplication.job_title}
                    existingApplication={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                    onSuccess={handleApplicationUpdated}
                />
            )}
        </div>
    );
}

export default MyApplications;
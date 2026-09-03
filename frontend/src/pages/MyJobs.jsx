import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const statusBadgeClass = (status) => {
    if (status === "Completed")   return "badge-completed";
    if (status === "In Progress") return "badge-in-progress";
    if (status === "Open")        return "badge-open";
    return "badge-open";
};

function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchJobs = useCallback(async () => {
        try {
            const response = await api.get("/jobs/my-jobs/");
            setJobs(response.data);
        } catch (requestError) {
            console.error(requestError);
            setError("Failed to load your jobs.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(fetchJobs, 0);
        return () => clearTimeout(timer);
    }, [fetchJobs]);

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await api.delete(`/jobs/${jobId}/`);
            setJobs((current) => current.filter((job) => job.id !== jobId));
        } catch (requestError) {
            console.error(requestError);
            setError("Failed to delete job.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                    <div className="spinner" />
                    <p className="text-sm text-text-muted">Loading your jobs…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="mx-auto max-w-[1100px] px-6 py-12 lg:px-10">

                {/* Page header */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            Client dashboard
                        </p>
                        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-text-main">
                            My Jobs
                        </h1>
                        <p className="mt-2 text-sm text-text-muted">
                            Manage the projects you have posted.
                        </p>
                    </div>
                    <Link
                        to="/jobs/create"
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.3)]"
                    >
                        + Post a Job
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {error ? null : jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface px-6 py-24 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-hover text-2xl">
                            📋
                        </div>
                        <h2 className="font-display text-xl font-bold text-text-main">
                            No jobs posted yet
                        </h2>
                        <p className="mt-2 max-w-xs text-sm text-text-muted">
                            Post your first job and start finding talented freelancers.
                        </p>
                        <Link
                            to="/jobs/create"
                            className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover"
                        >
                            Post a Job
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <article
                                key={job.id}
                                className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-primary/25 hover:shadow-[0_4px_20px_rgba(0,192,88,0.07)]"
                            >
                                <div className="p-6 sm:p-7">

                                    {/* Top row */}
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div>
                                            <h2 className="font-display text-xl font-bold text-text-main sm:text-2xl">
                                                {job.title}
                                            </h2>
                                            <p className="mt-1 text-sm text-text-muted">{job.category}</p>
                                        </div>
                                        <span className={`h-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusBadgeClass(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-text-muted">
                                        {job.description}
                                    </p>

                                    {/* Stats row */}
                                    <div className="mt-6 grid gap-5 border-t border-border pt-5 sm:grid-cols-3">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">Budget</p>
                                            <p className="mt-1.5 text-xl font-bold text-text-main">${job.budget}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">Deadline</p>
                                            <p className="mt-1.5 text-sm font-semibold text-text-main">{job.deadline}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-subtle">Applications</p>
                                            <p className="mt-1.5 text-xl font-bold text-text-main">{job.applications_count ?? 0}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                                        <Link
                                            to={`/jobs/${job.id}`}
                                            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_12px_rgba(0,192,88,0.28)]"
                                        >
                                            View Job
                                        </Link>

                                        {job.status === "Open" && (
                                            <>
                                                <Link
                                                    to={`/jobs/${job.id}/edit`}
                                                    className="rounded-xl border border-border bg-surface-hover px-5 py-2.5 text-sm font-semibold text-text-main transition-all duration-200 hover:border-primary/30 hover:text-primary"
                                                >
                                                    Edit Job
                                                </Link>
                                                <Link
                                                    to={`/jobs/${job.id}#applications`}
                                                    className="rounded-xl border border-border bg-surface-hover px-5 py-2.5 text-sm font-semibold text-text-muted transition-all duration-200 hover:border-primary/30 hover:text-text-main"
                                                >
                                                    Applications
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(job.id)}
                                                    className="rounded-xl border border-red-500/20 px-5 py-2.5 text-sm font-semibold text-red-400 transition-all duration-200 hover:bg-red-500/8"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}

                                        {job.status === "In Progress" && (
                                            <span className="text-xs text-text-muted">
                                                Manage completion from Job Details
                                            </span>
                                        )}
                                    </div>

                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default MyJobs;

import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/useAuth";
import { useSavedJobs } from "../hooks/useSavedJobs";


function SavedJobs() {
    const { user, loading: authLoading } = useAuth();
    const {
        savedJobs,
        loading,
        error,
        isJobPending,
        toggleSavedJob,
    } = useSavedJobs(user, authLoading);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                    <div className="spinner" />
                    <p className="text-sm text-text-muted">Loading saved jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="mx-auto max-w-[1100px] px-6 py-12 lg:px-10">
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            Your shortlist
                        </p>
                        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-text-main">
                            Saved Jobs
                        </h1>
                        <p className="mt-2 text-sm text-text-muted">
                            Keep interesting opportunities close while you decide what to apply for.
                        </p>
                    </div>
                    <Link
                        to="/jobs"
                        className="inline-flex w-fit rounded-full border border-border bg-surface-hover px-5 py-2.5 text-sm font-semibold text-text-main transition-all hover:border-primary/30 hover:text-primary"
                    >
                        Browse Jobs
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {error ? null : savedJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface px-6 py-24 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-hover text-2xl">
                            ♡
                        </div>
                        <h2 className="font-display text-xl font-bold text-text-main">
                            No saved jobs yet
                        </h2>
                        <p className="mt-2 max-w-xs text-sm text-text-muted">
                            Save jobs from the marketplace and they will appear here.
                        </p>
                        <Link
                            to="/jobs"
                            className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover"
                        >
                            Find Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {savedJobs.map((savedJob) => (
                            <JobCard
                                key={savedJob.id}
                                job={savedJob.job}
                                user={user}
                                isSaved
                                isPending={isJobPending(savedJob.job_id)}
                                onToggleSaved={toggleSavedJob}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default SavedJobs;

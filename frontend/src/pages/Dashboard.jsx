import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import { getClientDashboard, getFreelancerDashboard } from "../services/dashboard";

function StatusBadge({ status }) {
    const map = {
        Open: "badge-open",
        "In Progress": "badge-in-progress",
        Completed: "badge-completed",
        Accepted: "badge-accepted",
        Rejected: "badge-rejected",
        Pending: "badge-pending",
    };
    return (
        <span className={`inline-flex h-6 items-center rounded-full px-3 text-[10px] font-bold uppercase tracking-wide ${map[status] ?? "badge-open"}`}>
            {status}
        </span>
    );
}

function Dashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {
        if (!user) return;
        setLoading(true);
        setError("");
        try {
            if (user.role === "freelancer") {
                const res = await getFreelancerDashboard();
                setData(res);
            } else if (user.role === "client") {
                const res = await getClientDashboard();
                setData(res);
            }
        } catch (err) {
            console.error("Failed to load dashboard metrics:", err);
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Failed to load dashboard metrics."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                    <div className="spinner" />
                    <p className="text-sm text-text-muted">Loading your dashboard…</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="mx-auto max-w-[900px] px-6 py-20">
                    <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-8 text-center">
                        <h2 className="font-display text-xl font-bold text-red-400">
                            Failed to load dashboard
                        </h2>
                        <p className="mt-2 text-sm text-red-300">{error || "Unable to fetch dashboard metrics."}</p>
                        <button
                            type="button"
                            onClick={fetchDashboardData}
                            className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isFreelancer = user?.role === "freelancer";
    const profile = data.profile_summary || {};
    const reviewsSummary = data.reviews_summary || {};
    const initialLetter = (profile.display_name || user?.username || "U").slice(0, 1).toUpperCase();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Header Banner */}
            <section className="relative overflow-hidden border-b border-border bg-ink text-white">
                <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent" />
                <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10 lg:py-12">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        
                        {/* User Profile Summary */}
                        <div className="flex items-center gap-5">
                            {profile.profile_image ? (
                                <img
                                    src={profile.profile_image}
                                    alt={profile.display_name}
                                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-primary/40 shadow-lg sm:h-20 sm:w-20"
                                />
                            ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-2xl font-extrabold text-primary ring-2 ring-primary/40 shadow-lg sm:h-20 sm:w-20">
                                    {initialLetter}
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                        Welcome back, {profile.display_name || user?.username}!
                                    </h1>
                                    <span className="rounded-full bg-primary/15 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary border border-primary/30">
                                        {user?.role}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-text-muted">
                                    {isFreelancer ? "Freelancer Dashboard & Overview" : "Client Dashboard & Overview"}
                                </p>
                            </div>
                        </div>

                        {/* Quick Header Actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                to="/profile"
                                className="rounded-xl border border-border bg-surface-hover px-4 py-2.5 text-sm font-semibold text-text-main transition-all hover:border-primary/30 hover:text-primary"
                            >
                                👤 My Profile
                            </Link>

                            {isFreelancer ? (
                                <Link
                                    to="/my-applications"
                                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-[#07130c] transition-all hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.35)]"
                                >
                                    📄 My Applications
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/my-jobs"
                                        className="rounded-xl border border-border bg-surface-hover px-4 py-2.5 text-sm font-semibold text-text-main transition-all hover:border-primary/30 hover:text-primary"
                                    >
                                        📋 My Jobs
                                    </Link>
                                    <Link
                                        to="/jobs/create"
                                        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-[#07130c] transition-all hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.35)]"
                                    >
                                        + Post a Job
                                    </Link>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </section>

            {/* Main Dashboard Layout */}
            <main className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">

                {/* KEY STATS METRIC GRID */}
                <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {isFreelancer ? (
                        <>
                            {/* Card 1: Total Applications */}
                            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-subtle">Total Applications</p>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg">📄</span>
                                </div>
                                <p className="mt-3 font-display text-3xl font-bold text-text-main">{data.total_applications}</p>
                                <div className="mt-3 flex gap-2 text-[11px] font-semibold text-text-muted border-t border-border pt-3">
                                    <span className="text-amber-400">⏳ {data.pending_applications} Pending</span>
                                    <span>•</span>
                                    <span className="text-primary">✓ {data.accepted_applications} Accepted</span>
                                </div>
                            </div>

                            {/* Card 2: Active Jobs */}
                            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-subtle">Active Jobs</p>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-lg text-purple-400">⚡</span>
                                </div>
                                <p className="mt-3 font-display text-3xl font-bold text-text-main">{data.active_jobs}</p>
                                <p className="mt-3 text-xs text-text-muted border-t border-border pt-3">Currently in progress</p>
                            </div>

                            {/* Card 3: Completed Jobs */}
                            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-subtle">Completed Jobs</p>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-lg text-blue-400">🏆</span>
                                </div>
                                <p className="mt-3 font-display text-3xl font-bold text-text-main">{data.completed_jobs}</p>
                                <p className="mt-3 text-xs text-text-muted border-t border-border pt-3">Successfully delivered</p>
                            </div>

                            {/* Card 4: Rating & Reviews */}
                            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-subtle">Rating & Reviews</p>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-lg text-amber-400">★</span>
                                </div>
                                <p className="mt-3 font-display text-3xl font-bold text-amber-400">
                                    {reviewsSummary.rating !== null && reviewsSummary.rating !== undefined ? `★ ${reviewsSummary.rating}` : "N/A"}
                                </p>
                                <p className="mt-3 text-xs text-text-muted border-t border-border pt-3">
                                    Based on {reviewsSummary.reviews_count || 0} client reviews
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Card 1: Total Jobs Posted */}
                            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-subtle">Jobs Posted</p>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-lg">📋</span>
                                </div>
                                <p className="mt-3 font-display text-3xl font-bold text-text-main">{data.total_jobs_posted}</p>
                                <div className="mt-3 flex gap-2 text-[11px] font-semibold text-text-muted border-t border-border pt-3">
                                    <span className="text-primary">{data.open_jobs} Open</span>
                                    <span>•</span>
                                    <span className="text-purple-400">{data.in_progress_jobs} Active</span>
                                </div>
                            </div>

                            {/* Card 2: Applications Received */}
                            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-subtle">Applications Received</p>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-lg text-blue-400">📩</span>
                                </div>
                                <p className="mt-3 font-display text-3xl font-bold text-text-main">{data.total_applications_received}</p>
                                <p className="mt-3 text-xs text-amber-400 border-t border-border pt-3 font-semibold">
                                    ⏳ {data.pending_applications} pending review
                                </p>
                            </div>

                            {/* Card 3: Completed Jobs */}
                            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-subtle">Completed Jobs</p>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10 text-lg text-green-400">✅</span>
                                </div>
                                <p className="mt-3 font-display text-3xl font-bold text-text-main">{data.completed_jobs}</p>
                                <p className="mt-3 text-xs text-text-muted border-t border-border pt-3">Finished projects</p>
                            </div>

                            {/* Card 4: Unread Notifications */}
                            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-subtle">Notifications</p>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-lg text-amber-400">🔔</span>
                                </div>
                                <p className="mt-3 font-display text-3xl font-bold text-text-main">{data.unread_notifications_count}</p>
                                <p className="mt-3 text-xs text-text-muted border-t border-border pt-3">
                                    Unread messages & updates
                                </p>
                            </div>
                        </>
                    )}
                </section>

                {/* QUICK LINKS BAR */}
                <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🚀</span>
                        <div>
                            <p className="text-sm font-bold text-text-main">Quick Navigation</p>
                            <p className="text-xs text-text-muted">Jump directly to your key workspace pages.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs font-semibold">
                        {isFreelancer ? (
                            <>
                                <Link to="/my-applications" className="rounded-xl border border-border bg-surface-hover px-4 py-2 text-text-main hover:border-primary/40 hover:text-primary transition-all">
                                    📄 My Applications
                                </Link>
                                <Link to="/jobs" className="rounded-xl border border-border bg-surface-hover px-4 py-2 text-text-main hover:border-primary/40 hover:text-primary transition-all">
                                    🔍 Browse Jobs
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/my-jobs" className="rounded-xl border border-border bg-surface-hover px-4 py-2 text-text-main hover:border-primary/40 hover:text-primary transition-all">
                                    📋 My Jobs
                                </Link>
                                <Link to="/jobs/create" className="rounded-xl border border-border bg-surface-hover px-4 py-2 text-text-main hover:border-primary/40 hover:text-primary transition-all">
                                    + Post New Job
                                </Link>
                            </>
                        )}
                        <Link to="/messages" className="rounded-xl border border-border bg-surface-hover px-4 py-2 text-text-main hover:border-primary/40 hover:text-primary transition-all">
                            💬 Messages
                        </Link>
                        <Link to="/notifications" className="rounded-xl border border-border bg-surface-hover px-4 py-2 text-text-main hover:border-primary/40 hover:text-primary transition-all">
                            🔔 Notifications ({data.unread_notifications_count})
                        </Link>
                        <Link to="/profile" className="rounded-xl border border-border bg-surface-hover px-4 py-2 text-text-main hover:border-primary/40 hover:text-primary transition-all">
                            👤 Edit Profile
                        </Link>
                    </div>
                </section>

                {/* DETAILED CONTENT GRID */}
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">

                    {/* MAIN COLUMN (2 cols) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* FREELANCER: Recent Applications */}
                        {isFreelancer && (
                            <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm">
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div>
                                        <h2 className="font-display text-xl font-bold text-text-main">Recent Applications</h2>
                                        <p className="mt-0.5 text-xs text-text-muted">Jobs you have submitted proposals for.</p>
                                    </div>
                                    <Link to="/my-applications" className="text-xs font-semibold text-primary hover:text-primary-hover">
                                        View all →
                                    </Link>
                                </div>

                                <div className="mt-5 space-y-4">
                                    {!data.recent_applications || data.recent_applications.length === 0 ? (
                                        <p className="py-6 text-center text-xs text-text-muted">No applications submitted yet.</p>
                                    ) : (
                                        data.recent_applications.map((app) => (
                                            <div key={app.id} className="rounded-2xl border border-border bg-surface-hover p-5">
                                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                                    <div>
                                                        <Link to={`/jobs/${app.job}`} className="font-display text-base font-bold text-text-main hover:text-primary transition-colors">
                                                            {app.job_title}
                                                        </Link>
                                                        <p className="mt-1 text-xs text-text-muted">
                                                            Applied on {new Date(app.created_at).toLocaleDateString()} • Bid: <span className="font-semibold text-text-main">${app.bid_amount}</span>
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={app.status} />
                                                </div>
                                                <p className="mt-3 line-clamp-2 text-xs leading-5 text-text-muted border-t border-border pt-3">
                                                    {app.proposal}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* CLIENT: Recent Jobs */}
                        {!isFreelancer && (
                            <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm">
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div>
                                        <h2 className="font-display text-xl font-bold text-text-main">Recent Jobs</h2>
                                        <p className="mt-0.5 text-xs text-text-muted">Projects you have posted.</p>
                                    </div>
                                    <Link to="/my-jobs" className="text-xs font-semibold text-primary hover:text-primary-hover">
                                        View all →
                                    </Link>
                                </div>

                                <div className="mt-5 space-y-4">
                                    {!data.recent_jobs || data.recent_jobs.length === 0 ? (
                                        <p className="py-6 text-center text-xs text-text-muted">No jobs posted yet.</p>
                                    ) : (
                                        data.recent_jobs.map((job) => (
                                            <div key={job.id} className="rounded-2xl border border-border bg-surface-hover p-5">
                                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                                    <div>
                                                        <Link to={`/jobs/${job.id}`} className="font-display text-base font-bold text-text-main hover:text-primary transition-colors">
                                                            {job.title}
                                                        </Link>
                                                        <p className="mt-1 text-xs text-text-muted">
                                                            Category: {job.category} • Budget: <span className="font-semibold text-text-main">${job.budget}</span> • Applications: <span className="font-semibold text-primary">{job.applications_count ?? 0}</span>
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={job.status} />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* CLIENT: Recent Applications Received */}
                        {!isFreelancer && (
                            <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm">
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div>
                                        <h2 className="font-display text-xl font-bold text-text-main">Recent Applications Received</h2>
                                        <p className="mt-0.5 text-xs text-text-muted">Proposals submitted by freelancers.</p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-4">
                                    {!data.recent_applications || data.recent_applications.length === 0 ? (
                                        <p className="py-6 text-center text-xs text-text-muted">No applications received yet.</p>
                                    ) : (
                                        data.recent_applications.map((app) => (
                                            <div key={app.id} className="rounded-2xl border border-border bg-surface-hover p-5">
                                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            {app.freelancer_id ? (
                                                                <Link to={`/profile/${app.freelancer_id}`} className="font-bold text-sm text-text-main hover:text-primary transition-colors">
                                                                    {app.freelancer}
                                                                </Link>
                                                            ) : (
                                                                <span className="font-bold text-sm text-text-main">{app.freelancer}</span>
                                                            )}
                                                            <span className="text-xs text-text-muted">for</span>
                                                            <Link to={`/jobs/${app.job}`} className="text-xs font-semibold text-primary hover:underline">
                                                                {app.job_title}
                                                            </Link>
                                                        </div>
                                                        <p className="mt-1 text-xs text-text-muted">
                                                            Bid Amount: <span className="font-semibold text-text-main">${app.bid_amount}</span>
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={app.status} />
                                                </div>
                                                <p className="mt-3 line-clamp-2 text-xs leading-5 text-text-muted border-t border-border pt-3">
                                                    {app.proposal}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* SIDEBAR COLUMN (1 col) */}
                    <aside className="space-y-8">

                        {/* Recent Notifications Widget */}
                        <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm">
                            <div className="flex items-center justify-between border-b border-border pb-4">
                                <h2 className="font-display text-lg font-bold text-text-main">Recent Notifications</h2>
                                <Link to="/notifications" className="text-xs font-semibold text-primary hover:text-primary-hover">
                                    View all
                                </Link>
                            </div>

                            <div className="mt-4 space-y-3">
                                {!data.recent_notifications || data.recent_notifications.length === 0 ? (
                                    <p className="py-4 text-center text-xs text-text-muted">No notifications.</p>
                                ) : (
                                    data.recent_notifications.map((notif) => (
                                        <div key={notif.id} className={`rounded-xl border border-border p-3.5 text-xs ${notif.is_read ? "bg-surface" : "bg-primary/5 border-primary/20"}`}>
                                            <p className="text-text-main leading-5">{notif.message}</p>
                                            <p className="mt-1 text-[10px] text-text-muted">
                                                {new Date(notif.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Reviews & Ratings Summary Widget */}
                        <div className="rounded-3xl border border-border bg-surface p-7 shadow-sm">
                            <div className="flex items-center justify-between border-b border-border pb-4">
                                <h2 className="font-display text-lg font-bold text-text-main">Reviews Summary</h2>
                                {reviewsSummary.rating !== null && reviewsSummary.rating !== undefined && (
                                    <span className="text-sm font-bold text-amber-400">★ {reviewsSummary.rating}</span>
                                )}
                            </div>

                            <div className="mt-4 space-y-4">
                                {!reviewsSummary.recent_reviews || reviewsSummary.recent_reviews.length === 0 ? (
                                    <p className="py-4 text-center text-xs text-text-muted">No reviews yet.</p>
                                ) : (
                                    reviewsSummary.recent_reviews.map((rev) => (
                                        <div key={rev.id} className="rounded-xl border border-border bg-surface-hover p-4 text-xs space-y-1.5">
                                            <div className="flex items-center justify-between font-bold text-text-main">
                                                <span>{rev.reviewer}</span>
                                                <span className="text-amber-400">{"★".repeat(rev.rating)}</span>
                                            </div>
                                            <p className="text-[10px] text-text-muted">Project: {rev.job_title}</p>
                                            <p className="text-text-muted leading-4">{rev.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </aside>

                </div>

            </main>
        </div>
    );
}

export default Dashboard;

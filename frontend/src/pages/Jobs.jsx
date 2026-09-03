import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import { useSavedJobs } from "../hooks/useSavedJobs";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
    });

    const { user, loading: authLoading } = useAuth();
    const { isJobSaved, isJobPending, toggleSavedJob } = useSavedJobs(user, authLoading);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError(null);

            const params = { page };
            if (searchTerm.trim()) params.search = searchTerm.trim();
            if (selectedCategory) params.category = selectedCategory;
            if (minBudget) params.min_budget = minBudget;
            if (maxBudget) params.max_budget = maxBudget;
            if (selectedStatus) params.status = selectedStatus;

            try {
                const response = await api.get("/jobs/", { params });
                const data = response.data;
                setJobs(Array.isArray(data) ? data : data.results || []);
                setPagination({
                    count: Array.isArray(data) ? data.length : data.count || 0,
                    next: Array.isArray(data) ? null : data.next,
                    previous: Array.isArray(data) ? null : data.previous,
                });
            } catch (requestError) {
                console.error(requestError);
                setJobs([]);
                setPagination({ count: 0, next: null, previous: null });
                setError("Failed to load jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [searchTerm, selectedCategory, minBudget, maxBudget, selectedStatus, page]);

    /* ── Loading ───────────────────────────────────────────────── */
    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                    <div className="spinner" />
                    <p className="text-sm text-text-muted">Loading jobs…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    const filteredJobs = jobs;

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setMinBudget("");
        setMaxBudget("");
        setSelectedStatus("");
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-background">

            <Navbar />

            {/* ── HERO BANNER ──────────────────────────────────────── */}
            <section className="mx-auto max-w-[1400px] px-6 pt-8 lg:px-10">
                <div className="relative overflow-hidden rounded-3xl border border-border bg-[radial-gradient(circle_at_80%_20%,rgba(0,192,88,.18),transparent_30%),linear-gradient(135deg,#1a1a25,#14141a)] px-7 py-10 sm:px-10">

                    {/* Decorative ring */}
                    <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full border-[40px] border-primary/8" />

                    <div className="relative z-10 max-w-3xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(0,192,88,0.9)]" />
                            Find your next opportunity
                        </div>

                        <h1 className="font-display text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
                            Projects that fit the work you do best.
                        </h1>

                        <p className="mt-3 text-sm leading-7 text-text-muted sm:text-base">
                            Browse client projects, send a strong proposal, and keep your freelance work moving.
                        </p>

                        {/* Search bar */}
                        <div className="mt-7 flex max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-background sm:flex-row">
                            <input
                                value={searchTerm}
                                onChange={(event) => {
                                    setSearchTerm(event.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search for projects, skills, or categories…"
                                className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm text-text-main outline-none placeholder:text-text-muted"
                            />
                            <button
                                type="button"
                                className="bg-primary px-8 py-4 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover"
                            >
                                Search
                            </button>
                        </div>

                        {/* Quick categories */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {["All", "Web Development", "UI/UX Design", "Writing", "Data & Analytics"].map((category) => {
                                const active = category === "All" ? !selectedCategory : selectedCategory === category;
                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategory(category === "All" ? "" : category);
                                            setPage(1);
                                        }}
                                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                            active
                                                ? "border-primary/50 bg-primary/12 text-primary shadow-[0_0_8px_rgba(0,192,88,0.18)]"
                                                : "border-border bg-surface text-text-muted hover:border-primary/30 hover:text-primary"
                                        }`}
                                    >
                                        {category}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>


            {/* ── USER BAR ─────────────────────────────────────────── */}
            <div className="mx-auto max-w-[1400px] px-6 pt-6 lg:px-10">
                {authLoading ? null : user ? (
                    <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-5 py-3">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary ring-1 ring-primary/25">
                                {user.username?.slice(0, 1).toUpperCase()}
                            </span>
                            <p className="text-sm text-text-muted">
                                Welcome,{" "}
                                <span className="font-semibold text-text-main">{user.username}</span>
                                <span className="ml-1.5 inline-flex h-5 items-center rounded-full bg-surface-hover px-2 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                                    {user.role}
                                </span>
                            </p>
                        </div>
                        {user.role === "client" && (
                            <Link
                                to="/jobs/create"
                                className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_14px_rgba(0,192,88,0.3)]"
                            >
                                + Post a Job
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-5 py-3 text-sm text-text-muted">
                        <span>Please</span>
                        <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">login</Link>
                        <span>to access more features.</span>
                    </div>
                )}
            </div>


            {/* ── MAIN GRID ────────────────────────────────────────── */}
            <section className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">

                <div className="grid items-start gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">

                    {/* ── SIDEBAR ─────────────────────────────────── */}
                    <aside className="space-y-4 lg:sticky lg:top-6">

                        {/* User / Stats card */}
                        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                            <div className="relative overflow-hidden bg-gradient-to-br from-primary/15 to-primary/3 p-5">
                                <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/10 blur-xl" />
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20 text-lg font-extrabold text-primary ring-2 ring-primary/30">
                                    {user?.username?.slice(0, 1).toUpperCase() || "F"}
                                </div>
                                <p className="mt-3 text-sm font-bold text-text-main">{user ? user.username : "Your freelance space"}</p>
                                <p className="mt-0.5 text-xs capitalize text-text-muted">{user ? user.role : "Explore projects and grow your work"}</p>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
                                <div className="p-4">
                                    <p className="text-xl font-bold text-primary">{pagination.count}</p>
                                    <p className="mt-0.5 text-xs text-text-muted">Open projects</p>
                                </div>
                                <div className="p-4">
                                    <p className="text-xl font-bold text-text-main">24h</p>
                                    <p className="mt-0.5 text-xs text-text-muted">Fresh listings</p>
                                </div>
                            </div>
                            {!user && (
                                <div className="p-4">
                                    <Link
                                        to="/register"
                                        className="flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_12px_rgba(0,192,88,0.3)]"
                                    >
                                        Create your profile
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Filters */}
                        <div className="rounded-2xl border border-border bg-surface p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-text-main">Filters</h3>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-xs font-semibold text-text-muted transition-colors hover:text-primary"
                                >
                                    Clear all
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Min Budget */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Min Budget
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={minBudget}
                                        onChange={(e) => {
                                            setMinBudget(e.target.value);
                                            setPage(1);
                                        }}
                                        placeholder="e.g. 100"
                                        className="field"
                                    />
                                </div>

                                {/* Max Budget */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Max Budget
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={maxBudget}
                                        onChange={(e) => {
                                            setMaxBudget(e.target.value);
                                            setPage(1);
                                        }}
                                        placeholder="e.g. 1000"
                                        className="field"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Status
                                    </label>
                                    <select
                                        value={selectedStatus}
                                        onChange={(e) => {
                                            setSelectedStatus(e.target.value);
                                            setPage(1);
                                        }}
                                        className="field"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Open">Open</option>
                                    </select>
                                </div>

                            </div>
                        </div>

                        {/* Pro tip card */}
                        <div className="rounded-2xl border border-border bg-surface p-5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Pro tip</p>
                            <h3 className="mt-2.5 text-sm font-bold text-text-main">A strong proposal gets noticed.</h3>
                            <p className="mt-2 text-xs leading-5 text-text-muted">Mention the client's goal, share one relevant outcome, then be clear about your next step.</p>
                            <a href="#how-it-works" className="mt-3 inline-flex text-xs font-bold text-primary transition-colors hover:text-primary-hover">
                                Proposal guide →
                            </a>
                        </div>

                    </aside>

                    {/* ── JOB LIST ────────────────────────────────── */}
                    <div>

                        {/* Section header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">Explore opportunities</p>
                                <h2 className="mt-1 font-display text-2xl font-bold text-text-main">Recent projects</h2>
                            </div>
                            <span className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-semibold text-text-muted">
                                {pagination.count} {pagination.count === 1 ? "job" : "jobs"}
                            </span>
                        </div>

                        {/* Empty state */}
                        {filteredJobs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface px-6 py-24 text-center">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-hover text-2xl">
                                    🔍
                                </div>
                                <h3 className="font-display text-xl font-bold text-text-main">No jobs found</h3>
                                <p className="mt-2 max-w-xs text-sm text-text-muted">
                                    Try adjusting your search term or filters.
                                </p>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-6 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (

                            /* ── JOB CARDS ─────────────────────────────── */
                            <div>
                                <div className="space-y-4">
                                    {filteredJobs.map((job) => (
                                        <JobCard
                                            key={job.id}
                                            job={job}
                                            user={user}
                                            isSaved={isJobSaved(job.id)}
                                            isPending={isJobPending(job.id)}
                                            onToggleSaved={toggleSavedJob}
                                        />
                                    ))}
                                </div>

                                {(pagination.previous || pagination.next) && (
                                    <div className="mt-8 flex items-center justify-between rounded-2xl border border-border bg-surface p-4">
                                        <button
                                            type="button"
                                            onClick={() => setPage((current) => Math.max(1, current - 1))}
                                            disabled={!pagination.previous || loading}
                                            className="rounded-xl border border-border bg-surface-hover px-4 py-2 text-sm font-semibold text-text-main transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-xs font-semibold text-text-muted">Page {page}</span>
                                        <button
                                            type="button"
                                            onClick={() => setPage((current) => current + 1)}
                                            disabled={!pagination.next || loading}
                                            className="rounded-xl border border-border bg-surface-hover px-4 py-2 text-sm font-semibold text-text-main transition-colors hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>

                        )}
                    </div>

                </div>
            </section>

            <HowItWorks />
            <CTA />
            <Footer />

        </div>
    );
}

export default Jobs;

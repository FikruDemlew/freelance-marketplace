import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

/* ── Small badge helper ─────────────────────────────────────────── */
function StatusBadge({ status }) {
    const map = {
        Open:        "badge-open",
        Closed:      "badge-closed",
        "In Progress": "badge-in-progress",
        Completed:   "badge-completed",
    };
    return (
        <span className={`inline-flex h-6 items-center rounded-full px-3 text-[10px] font-bold uppercase tracking-wide ${map[status] ?? "badge-open"}`}>
            {status}
        </span>
    );
}

/* ── Category colour map ────────────────────────────────────────── */
const categoryColors = {
    "Web Development":   "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20",
    "Mobile Development":"bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20",
    "UI/UX Design":      "bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/20",
    "Graphics Design":   "bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20",
    "Writing":           "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
    "Data Science":      "bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20",
    "Data & Analytics":  "bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20",
    "Other":             "bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20",
};
const defaultCategoryColor = "bg-primary/10 text-primary ring-1 ring-primary/20";

function Jobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [minBudget, setMinBudget] = useState("");
    const [maxBudget, setMaxBudget] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs/");
                setJobs(response.data);
            } catch {
                setError("Failed to load jobs.");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

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

    /* ── Filter + Sort ─────────────────────────────────────────── */
    const filteredJobs = jobs
        .filter((job) => {
            const search = searchTerm.toLowerCase().trim();
            const matchesSearch =
                job.title.toLowerCase().includes(search) ||
                job.description.toLowerCase().includes(search) ||
                job.category.toLowerCase().includes(search);
            const matchesCategory =
                selectedCategory === "" ||
                job.category.toLowerCase() === selectedCategory.toLowerCase();
            const matchesMinBudget =
                minBudget === "" || Number(job.budget) >= Number(minBudget);
            const matchesMaxBudget =
                maxBudget === "" || Number(job.budget) <= Number(maxBudget);
            const matchesStatus =
                selectedStatus === "" ||
                job.status.toLowerCase() === selectedStatus.toLowerCase();
            return matchesSearch && matchesCategory && matchesMinBudget && matchesMaxBudget && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === "budget-low") return Number(a.budget) - Number(b.budget);
            if (sortBy === "budget-high") return Number(b.budget) - Number(a.budget);
            if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
            return new Date(b.created_at) - new Date(a.created_at);
        });

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setMinBudget("");
        setMaxBudget("");
        setSelectedStatus("");
        setSortBy("newest");
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
                                onChange={(event) => setSearchTerm(event.target.value)}
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
                                        onClick={() => setSelectedCategory(category === "All" ? "" : category)}
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
                                    <p className="text-xl font-bold text-primary">{filteredJobs.length}</p>
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
                                        onChange={(e) => setMinBudget(e.target.value)}
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
                                        onChange={(e) => setMaxBudget(e.target.value)}
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
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="field"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="Open">Open</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-muted">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="field"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="budget-low">Budget: Low to High</option>
                                        <option value="budget-high">Budget: High to Low</option>
                                        <option value="deadline">Deadline: Soonest</option>
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
                                {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
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
                            <div className="space-y-4">
                                {filteredJobs.map((job) => (
                                    <article
                                        key={job.id}
                                        className="group relative overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-primary/35 hover:shadow-[0_4px_24px_rgba(0,192,88,0.08)] hover:-translate-y-0.5"
                                    >
                                        {/* Subtle glow top-right on hover */}
                                        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/6 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        <div className="grid lg:grid-cols-[1fr_220px]">

                                            {/* LEFT — content */}
                                            <div className="p-6 sm:p-7">

                                                {/* Top row: category + save */}
                                                <div className="flex items-center justify-between">
                                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[job.category] ?? defaultCategoryColor}`}>
                                                        {job.category}
                                                    </span>

                                                    <div className="flex items-center gap-2">
                                                        <StatusBadge status={job.status} />
                                                        <button
                                                            type="button"
                                                            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-text-muted transition-all duration-200 hover:border-primary/40 hover:text-primary"
                                                            aria-label="Save job"
                                                        >
                                                            ♡
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <h3 className="job-card-title mt-4 text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                                                    {job.title}
                                                </h3>

                                                {/* Description */}
                                                <p className="job-card-copy mt-2.5 line-clamp-2 text-sm leading-6">
                                                    {job.description}
                                                </p>

                                                {/* Meta chips */}
                                                <div className="mt-4 flex flex-wrap items-center gap-3">
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                                                        <span className="text-primary">💰</span>
                                                        <span className="font-semibold text-text-main">${job.budget}</span>
                                                        budget
                                                    </span>
                                                    <span className="h-3 w-px bg-border" />
                                                    <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
                                                        <span>📅</span>
                                                        Due <span className="font-medium text-text-main">{job.deadline}</span>
                                                    </span>
                                                </div>

                                            </div>

                                            {/* RIGHT — action panel */}
                                            <div className="flex flex-col justify-between border-t border-border bg-background/35 p-5 sm:p-6 lg:border-l lg:border-t-0">

                                                {/* Budget highlight */}
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Budget</p>
                                                    <p className="mt-1.5 font-display text-3xl font-bold text-text-main">
                                                        ${job.budget}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-text-muted">Fixed price</p>
                                                </div>

                                                {/* Deadline */}
                                                <div className="mt-4">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">Deadline</p>
                                                    <p className="mt-1 text-sm font-semibold text-text-main">{job.deadline}</p>
                                                </div>

                                                {/* CTA */}
                                                <Link
                                                    to={`/jobs/${job.id}`}
                                                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.3)]"
                                                >
                                                    View Job
                                                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                                                </Link>

                                            </div>

                                        </div>
                                    </article>
                                ))}
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

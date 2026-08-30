import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function Jobs() {
    const navigate = useNavigate()
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
                navigate('/login')
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">Loading jobs...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // Filter jobs
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
            minBudget === "" ||
            Number(job.budget) >= Number(minBudget);

        const matchesMaxBudget =
            maxBudget === "" ||
            Number(job.budget) <= Number(maxBudget);

        const matchesStatus =
            selectedStatus === "" ||
            job.status.toLowerCase() === selectedStatus.toLowerCase();

        return (
            matchesSearch &&
            matchesCategory &&
            matchesMinBudget &&
            matchesMaxBudget &&
            matchesStatus
        );
    })
    .sort((a, b) => {
        if (sortBy === "budget-low") {
            return Number(a.budget) - Number(b.budget);
        }

        if (sortBy === "budget-high") {
            return Number(b.budget) - Number(a.budget);
        }

        if (sortBy === "deadline") {
            return new Date(a.deadline) - new Date(b.deadline);
        }

        // Default: newest jobs first
        return new Date(b.created_at) - new Date(a.created_at);
    });

    return (
        <div className="min-h-screen bg-background">

            {/* ================= NAVBAR ================= */}
            <Navbar />


            <section className="mx-auto max-w-[1400px] px-6 pt-8 lg:px-10">
                <div className="relative overflow-hidden rounded-[28px] border border-border bg-[radial-gradient(circle_at_80%_20%,rgba(0,192,88,.18),transparent_24%),linear-gradient(120deg,#202127,#17171c)] px-7 py-10 sm:px-10">
                    <div className="relative z-10 max-w-3xl">
                        <p className="text-sm font-bold text-primary">Find your next opportunity</p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Projects that fit the work you do best.</h1>
                        <p className="mt-3 text-sm leading-7 text-text-muted sm:text-base">Browse client projects, send a strong proposal, and keep your freelance work moving.</p>
                        <div className="mt-7 flex max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-background sm:flex-row">
                            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search for projects, skills, or categories" className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-text-muted" />
                            <button type="button" className="bg-primary px-8 py-4 text-sm font-bold text-[#07130c] transition hover:bg-primary-hover">Search</button>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {["All", "Web Development", "UI/UX Design", "Writing", "Data & Analytics"].map((category) => {
                                const active = category === "All" ? !selectedCategory : selectedCategory === category;
                                return <button key={category} type="button" onClick={() => setSelectedCategory(category === "All" ? "" : category)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${active ? "border-primary bg-primary text-[#07130c]" : "border-border bg-surface text-text-muted hover:border-primary"}`}>{category}</button>;
                            })}
                        </div>
                    </div>
                    <div aria-hidden="true" className="absolute -right-14 -bottom-20 h-72 w-72 rounded-full border-[32px] border-primary/20" />
                </div>
            </section>


            {/* ================= USER BAR ================= */}
            <div className="mx-auto max-w-[1400px] px-6 pt-6 lg:px-10">

                {authLoading ? (
                    <p className="text-sm text-gray-500">
                        Loading...
                    </p>
                ) : user ? (

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-gray-600">
                            Welcome,{" "}
                            <span className="font-semibold text-gray-900">
                                {user.username}
                            </span>{" "}
                            ({user.role})
                        </p>

                        {user.role === "client" && (
                            <Link
                                to="/jobs/create"
                                className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >
                                Post a Job
                            </Link>
                        )}

                    </div>

                ) : (

                    <p className="text-sm text-gray-600">
                        Please{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-black underline"
                        >
                            login
                        </Link>{" "}
                        to access more features.
                    </p>

                )}

            </div>


            {/* ================= POPULAR JOBS ================= */}
            <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">


                {/* Section Header */}
                <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

                    <div>{/* ================= FILTERS ================= */}
<div className="mx-auto max-w-[1400px] px-6 pt-10 lg:px-10">

    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">

        <div className="mb-5 flex items-center justify-between">

            <div>
                <h3 className="text-lg font-bold text-gray-950">
                    Filter Jobs
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    Narrow down jobs based on your preferences.
                </p>
            </div>

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Minimum Budget */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Min Budget
                </label>

                <input
                    type="number"
                    min="0"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400"
                />
            </div>


            {/* Maximum Budget */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Max Budget
                </label>

                <input
                    type="number"
                    min="0"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="e.g. 1000"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400"
                />
            </div>


            {/* Status */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Status
                </label>

                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400"
                >
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                </select>
            </div>


            {/* Sort */}
            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Sort By
                </label>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-400"
                >
                    <option value="newest">
                        Newest
                    </option>

                    <option value="budget-low">
                        Budget: Low to High
                    </option>

                    <option value="budget-high">
                        Budget: High to Low
                    </option>

                    <option value="deadline">
                        Deadline: Soonest
                    </option>
                </select>
            </div>

        </div>


        {/* Clear Filters */}
        <button
            type="button"
            onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setMinBudget("");
                setMaxBudget("");
                setSelectedStatus("");
                setSortBy("newest");
            }}
            className="mt-5 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
            Clear All Filters
        </button>

    </div>

</div>

                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                            Explore opportunities
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
                            Recent projects
                        </h2>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-500">
                            Find exciting projects from clients looking for
                            talented freelancers.
                        </p>

                    </div>


                    {/* Job Count */}
                    <div className="w-fit rounded-full border border-gray-200 bg-gray-50 px-5 py-3">

                        <span className="text-sm font-semibold text-gray-700">
                            {filteredJobs.length}{" "}
                            {filteredJobs.length === 1 ? "job" : "jobs"} found
                        </span>

                    </div>

                </div>


                <div className="grid items-start gap-7 lg:grid-cols-[280px_minmax(0,1fr)]">
                    <aside className="sticky top-6 space-y-4">
                        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                            <div className="bg-[linear-gradient(135deg,rgba(0,192,88,.24),rgba(0,192,88,.03))] p-5">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-[#07130c]">
                                    {user?.username?.slice(0, 1).toUpperCase() || "F"}
                                </div>
                                <p className="mt-4 text-sm font-bold text-text-main">{user ? user.username : "Your freelance space"}</p>
                                <p className="mt-1 text-xs text-text-muted">{user ? user.role : "Explore projects and grow your work"}</p>
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
                                <div className="p-4">
                                    <p className="text-lg font-bold text-primary">{filteredJobs.length}</p>
                                    <p className="mt-1 text-xs text-text-muted">Open projects</p>
                                </div>
                                <div className="p-4">
                                    <p className="text-lg font-bold text-text-main">24h</p>
                                    <p className="mt-1 text-xs text-text-muted">Fresh listings</p>
                                </div>
                            </div>
                            {!user && (
                                <Link to="/register" className="m-4 flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-[#07130c] transition hover:bg-primary-hover">
                                    Create your profile
                                </Link>
                            )}
                        </div>

                        <div className="rounded-2xl border border-border bg-surface p-5">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Pro tip</p>
                            <h3 className="mt-3 text-lg font-bold text-text-main">A strong proposal gets noticed.</h3>
                            <p className="mt-2 text-sm leading-6 text-text-muted">Mention the client’s goal, share one relevant outcome, then be clear about your next step.</p>
                            <a href="#how-it-works" className="mt-4 inline-flex text-sm font-bold text-primary hover:text-primary-hover">Proposal guide →</a>
                        </div>
                    </aside>

                    <div>
                {/* ================= NO JOBS ================= */}
                {filteredJobs.length === 0 ? (

                    <div className="rounded-[28px] border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">

                        <h3 className="text-2xl font-bold text-gray-900">
                            No jobs found
                        </h3>

                        <p className="mt-3 text-gray-600">
                            Try a different search term or category.
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("");
                            }}
                            className="mt-7 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            Clear Filters
                        </button>

                    </div>

                ) : (

                    /* ================= JOB GRID ================= */
                    <div className="space-y-4">

                        {filteredJobs.map((job) => (

                            <article
                                key={job.id}
                                className="job-card group grid overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-primary/50 lg:grid-cols-[1fr_260px]"
                            >

                                {/* ================= CARD TOP ================= */}
                                <div className="p-6 sm:p-7">

                                    {/* Category + Favorite */}
                                    <div className="flex items-center justify-between">

                                        <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700">
                                            {job.category}
                                        </span>

                                        <button
                                            type="button"
                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-xl text-gray-500 transition hover:bg-gray-900 hover:text-white"
                                            aria-label="Save job"
                                        >
                                            ♡
                                        </button>

                                    </div>


                                    {/* Title */}
                                    <h3 className="job-card-title mt-5 text-2xl font-bold leading-tight tracking-tight">
                                        {job.title}
                                    </h3>


                                    {/* Description */}
                                    <p className="job-card-copy mt-3 line-clamp-2 max-w-3xl text-sm leading-7">
                                        {job.description}
                                    </p>

                                </div>


                                {/* ================= CARD BOTTOM ================= */}
                                <div className="border-t border-border bg-background/45 px-6 py-6 sm:px-7 lg:border-l lg:border-t-0">

                                    {/* Budget + Deadline */}
                                    <div className="grid grid-cols-2 gap-5">

                                        {/* Budget */}
                                        <div>

                                            <p className="job-card-meta text-xs font-medium uppercase tracking-wider">
                                                Budget
                                            </p>

                                            <p className="job-card-title mt-2 text-2xl font-bold">
                                                ${job.budget}
                                            </p>

                                        </div>


                                        {/* Deadline */}
                                        <div>

                                            <p className="job-card-meta text-xs font-medium uppercase tracking-wider">
                                                Deadline
                                            </p>

                                            <p className="job-card-title mt-2 text-sm font-semibold">
                                                {job.deadline}
                                            </p>

                                        </div>

                                    </div>


                                    {/* View Job Button */}
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        className="mt-6 flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-[#07130c] transition hover:bg-primary-hover"
                                    >
                                        View Job

                                        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                                            →
                                        </span>
                                    </Link>

                                 

                                </div>

                            </article>

                        ))}

                    </div>

                )}
                    </div>
                </div>

                        </section>
{/* How It Works */}
<HowItWorks />

<CTA />

<Footer />

</div>
    );
}

export default Jobs;

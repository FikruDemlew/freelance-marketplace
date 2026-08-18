import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await api.get("/jobs/");
                setJobs(response.data);
            } catch (error) {
                setError("Failed to load jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
        console.log("User in Jobs component:", user);
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
    const filteredJobs = jobs.filter((job) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            job.title.toLowerCase().includes(search) ||
            job.description.toLowerCase().includes(search) ||
            job.category.toLowerCase().includes(search);

        const matchesCategory =
            selectedCategory === "" ||
            job.category.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-white">

            {/* ================= NAVBAR ================= */}
            <Navbar />


            {/* ================= HERO ================= */}
            <Hero
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />


            {/* ================= USER BAR ================= */}
            <div className="mx-auto max-w-[1400px] px-6 pt-8 lg:px-10">

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
            <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">

                {/* Section Header */}
                <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

                    <div>

                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                            Explore opportunities
                        </p>

                        <h2 className="text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
                            Popular Jobs
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
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

                        {filteredJobs.map((job) => (

                            <article
                                key={job.id}
                                className="group flex min-h-[460px] flex-col overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-gray-300 hover:shadow-2xl"
                            >

                                {/* ================= CARD TOP ================= */}
                                <div className="p-8 pb-6">

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
                                    <h3 className="mt-7 text-2xl font-bold leading-tight tracking-tight text-gray-950">
                                        {job.title}
                                    </h3>


                                    {/* Description */}
                                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-500">
                                        {job.description}
                                    </p>

                                </div>


                                {/* ================= CARD BOTTOM ================= */}
                                <div className="mt-auto border-t border-gray-100 px-8 py-7">

                                    {/* Budget + Deadline */}
                                    <div className="grid grid-cols-2 gap-6">

                                        {/* Budget */}
                                        <div>

                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                Budget
                                            </p>

                                            <p className="mt-2 text-2xl font-bold text-gray-950">
                                                ${job.budget}
                                            </p>

                                        </div>


                                        {/* Deadline */}
                                        <div>

                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                Deadline
                                            </p>

                                            <p className="mt-2 text-sm font-semibold text-gray-900">
                                                {job.deadline}
                                            </p>

                                        </div>

                                    </div>


                                    {/* View Job Button */}
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        className="mt-7 flex w-full items-center justify-center rounded-2xl bg-gray-950 px-5 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-800 group-hover:shadow-lg"
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

                        </section>
{/* How It Works */}
<HowItWorks />

<CTA />

<Footer />

</div>
    );
}

export default Jobs;
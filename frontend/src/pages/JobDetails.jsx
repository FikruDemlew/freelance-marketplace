import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            setError(
                error.response?.data ||
                "Failed to delete job."
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />

                <div className="mx-auto max-w-[1100px] px-6 py-20 text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading job...
                    </p>
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

    /*
     * Check whether the logged-in user owns the job.
     *
     * Depending on the backend serializer, job.client can be:
     * - a username
     * - an object containing username
     * - a user ID
     */

    const jobClientUsername =
        typeof job.client === "object"
            ? job.client?.username
            : job.client;

    const isOwner =
        user &&
        (
            user.username === jobClientUsername ||
            String(user.id) === String(job.client)
        );

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <Navbar />


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

                        {/* Category */}
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-gray-300">
                            {job.category}
                        </span>


                        {/* Title */}
                        <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                            {job.title}
                        </h1>


                        {/* Posted By */}
                        <p className="mt-5 text-sm text-gray-400">
                            Posted by{" "}
                            <span className="font-semibold text-white">
                                {typeof job.client === "object"
                                    ? job.client?.username
                                    : job.client}
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


                            {/* Budget */}
                            <div className="mt-7 border-b border-gray-100 pb-6">

                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Budget
                                </p>

                                <p className="mt-2 text-3xl font-bold text-gray-950">
                                    ${job.budget}
                                </p>

                            </div>


                            {/* Deadline */}
                            <div className="border-b border-gray-100 py-6">

                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Deadline
                                </p>

                                <p className="mt-2 text-base font-semibold text-gray-900">
                                    {job.deadline}
                                </p>

                            </div>


                            {/* Category */}
                            <div className="border-b border-gray-100 py-6">

                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                    Category
                                </p>

                                <p className="mt-2 text-base font-semibold text-gray-900">
                                    {job.category}
                                </p>

                            </div>


                            {/* Owner Actions */}
                            {isOwner ? (

                                <div className="mt-7 space-y-3">

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

                            ) : (

                                <div className="mt-7">

                                    <button
                                        type="button"
                                        className="w-full rounded-xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                                    >
                                        Submit a Proposal
                                    </button>

                                    <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                                        Interested in this project?
                                        Submit a proposal to the client.
                                    </p>

                                </div>

                            )}

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
}

export default JobDetails;
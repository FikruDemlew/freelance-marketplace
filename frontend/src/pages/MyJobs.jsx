import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function MyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchJobs = async () => {
        try {
            const response = await api.get("/jobs/my-jobs/");
            setJobs(response.data);
        } catch (requestError) {
            console.error(requestError);
            setError("Failed to load your jobs.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) {
            return;
        }

        try {
            await api.delete(`/jobs/${jobId}/`);
            setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
        } catch (requestError) {
            console.error(requestError);
            setError("Failed to delete job.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="mx-auto max-w-275 px-6 py-20 text-center">
                    <p className="text-sm text-gray-500">Loading your jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="mx-auto max-w-275 px-6 py-12 lg:px-10">
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                            Client dashboard
                        </p>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-950">
                            My Jobs
                        </h1>
                        <p className="mt-3 text-gray-500">
                            Manage the projects you have posted.
                        </p>
                    </div>
                    <Link
                        to="/jobs/create"
                        className="inline-flex w-fit rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                        Post a Job
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {jobs.length === 0 ? (
                    <div className="rounded-[28px] border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            You haven't posted any jobs yet.
                        </h2>
                        <Link
                            to="/jobs/create"
                            className="mt-7 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                        >
                            Post a Job
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {jobs.map((job) => (
                            <article
                                key={job.id}
                                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                            >
                                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-950">
                                            {job.title}
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-500">
                                            {job.category}
                                        </p>
                                    </div>
                                    <span className={`h-fit rounded-full px-4 py-2 text-xs font-semibold ${
                                        job.status === "Completed"
                                            ? "bg-blue-50 text-blue-700"
                                            : job.status === "In Progress"
                                            ? "bg-green-50 text-green-700"
                                            : "bg-yellow-50 text-yellow-700"
                                    }`}>
                                        {job.status}
                                    </span>
                                </div>

                                <p className="mt-5 line-clamp-2 text-sm leading-6 text-gray-600">
                                    {job.description}
                                </p>

                                <div className="mt-6 grid gap-5 border-t border-gray-100 pt-5 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Budget
                                        </p>
                                        <p className="mt-2 font-bold text-gray-950">${job.budget}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Deadline
                                        </p>
                                        <p className="mt-2 font-semibold text-gray-900">{job.deadline}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            Applications
                                        </p>
                                        <p className="mt-2 font-semibold text-gray-900">
                                            {job.applications_count ?? 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
                                    <Link
                                        to={`/jobs/${job.id}`}
                                        className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                                    >
                                        View Job
                                    </Link>
                                    {job.status === "Open" && (
                                        <>
                                            <Link
                                                to={`/jobs/${job.id}/edit`}
                                                className="rounded-xl bg-yellow-600 px-5 py-3 text-sm font-semibold text-white hover:bg-yellow-700"
                                            >
                                                Edit Job
                                            </Link>
                                            <Link
                                                to={`/jobs/${job.id}#applications`}
                                                className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                            >
                                                Manage Applications
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(job.id)}
                                                className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                                            >
                                                Delete Job
                                            </button>
                                        </>
                                    )}
                                    {job.status === "In Progress" && (
                                        <span className="self-center text-sm text-gray-500">
                                            Manage completion from Job Details
                                        </span>
                                    )}
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

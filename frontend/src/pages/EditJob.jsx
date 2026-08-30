import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import Navbar from "../components/Navbar";

function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Web Development",
        budget: "",
        deadline: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Get existing job
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/${id}/`);

                setFormData({
                    title: response.data.title || "",
                    description: response.data.description || "",
                    category: response.data.category || "Web Development",
                    budget: response.data.budget || "",
                    deadline: response.data.deadline || "",
                });
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data ||
                    "Failed to load job."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSaving(true);

        try {
            await api.patch(
                `/jobs/${id}/`,
                formData
            );

            navigate(`/jobs/${id}`);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data ||
                "Failed to update job."
            );
        } finally {
            setSaving(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />

                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                    <div className="spinner" />
                    <p className="text-sm text-text-muted">Loading job details…</p>
                </div>
            </div>
        );
    }

    // Error while loading
    if (error && !formData.title) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />

                <div className="mx-auto max-w-[900px] px-6 py-20">

                    <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-8 text-center">

                        <h2 className="font-display text-xl font-bold text-red-400">
                            Unable to load job
                        </h2>

                        <p className="mt-2 text-sm text-red-300">
                            {typeof error === "string"
                                ? error
                                : JSON.stringify(error)}
                        </p>

                        <Link
                            to="/jobs"
                            className="mt-6 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover"
                        >
                            Back to Jobs
                        </Link>

                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">

            {/* Navbar */}
            <Navbar />

            {/* Page Header */}
            <section className="border-b border-border bg-ink text-white">

                <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">

                    <Link
                        to={`/jobs/${id}`}
                        className="inline-flex items-center text-xs font-semibold text-text-muted transition-colors hover:text-primary"
                    >
                        ← Back to Job Details
                    </Link>

                    <div className="mt-6 max-w-3xl">

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            Manage Project
                        </p>

                        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                            Edit your job
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
                            Update your project details and make sure
                            freelancers have the information they need.
                        </p>

                    </div>

                </div>

            </section>

            {/* Form */}
            <main className="mx-auto max-w-[1000px] px-6 py-12 lg:px-10 lg:py-16">

                <div className="rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-10">

                    {/* Form heading */}
                    <div className="mb-10 border-b border-border pb-8">

                        <h2 className="font-display text-2xl font-bold tracking-tight text-text-main">
                            Job information
                        </h2>

                        <p className="mt-2 text-sm text-text-muted">
                            Make changes to your job information below.
                        </p>

                    </div>

                    {/* Update error */}
                    {error && (
                        <div className="mb-8 rounded-xl border border-red-500/25 bg-red-500/10 px-5 py-4">

                            <p className="text-sm font-medium text-red-400">
                                {typeof error === "string"
                                    ? error
                                    : JSON.stringify(error)}
                            </p>

                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-8"
                    >

                        {/* Job Title */}
                        <div>

                            <label
                                htmlFor="title"
                                className="mb-2 block text-sm font-semibold text-text-main"
                            >
                                Job Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="field"
                            />

                        </div>

                        {/* Description */}
                        <div>

                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-semibold text-text-main"
                            >
                                Project Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={7}
                                className="field resize-none leading-6"
                            />

                        </div>

                        {/* Category */}
                        <div>

                            <label
                                htmlFor="category"
                                className="mb-2 block text-sm font-semibold text-text-main"
                            >
                                Category
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="field"
                            >

                                <option value="Web Development">
                                    Web Development
                                </option>

                                <option value="Mobile Development">
                                    Mobile Development
                                </option>

                                <option value="UI/UX Design">
                                    UI/UX Design
                                </option>

                                <option value="Graphics Design">
                                    Graphics Design
                                </option>

                                <option value="Writing">
                                    Writing
                                </option>

                                <option value="Data Science">
                                    Data Science
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>

                        {/* Budget + Deadline */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                            {/* Budget */}
                            <div>

                                <label
                                    htmlFor="budget"
                                    className="mb-2 block text-sm font-semibold text-text-main"
                                >
                                    Budget <span className="font-normal text-text-muted">(USD)</span>
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">
                                        $
                                    </span>

                                    <input
                                        id="budget"
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        required
                                        className="field pl-9"
                                    />

                                </div>

                            </div>

                            {/* Deadline */}
                            <div>

                                <label
                                    htmlFor="deadline"
                                    className="mb-2 block text-sm font-semibold text-text-main"
                                >
                                    Deadline
                                </label>

                                <input
                                    id="deadline"
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    required
                                    className="field"
                                />

                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse gap-3 border-t border-border pt-8 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() => navigate(`/jobs/${id}`)}
                                className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-text-muted transition-all duration-200 hover:border-primary/30 hover:text-text-main"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-primary px-7 py-3 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving
                                    ? "Updating..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default EditJob;
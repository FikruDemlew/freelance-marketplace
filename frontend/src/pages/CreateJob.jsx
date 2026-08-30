import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../api/axios";
import Navbar from "../components/Navbar";

function CreateJob() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Web Development",
        budget: "",
        deadline: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
        setLoading(true);

        try {
            await api.post("/jobs/", formData);

            navigate("/jobs");
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data ||
                "Failed to create job."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">

            {/* Navbar */}
            <Navbar />

            {/* Page Header */}
            <section className="border-b border-border bg-ink text-white">

                <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">

                    <Link
                        to="/jobs"
                        className="inline-flex items-center text-xs font-semibold text-text-muted transition-colors hover:text-primary"
                    >
                        ← Back to Jobs
                    </Link>

                    <div className="mt-6 max-w-3xl">

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            For Clients
                        </p>

                        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">
                            Post a new job
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted">
                            Tell talented freelancers what you need and
                            find the right person for your project.
                        </p>

                    </div>

                </div>

            </section>


            {/* Form Area */}
            <main className="mx-auto max-w-[1000px] px-6 py-12 lg:px-10 lg:py-16">

                <div className="rounded-3xl border border-border bg-surface p-6 shadow-xl sm:p-10">

                    {/* Form Header */}
                    <div className="mb-10 border-b border-border pb-8">

                        <h2 className="font-display text-2xl font-bold tracking-tight text-text-main">
                            Job information
                        </h2>

                        <p className="mt-2 text-sm text-text-muted">
                            Provide enough details so freelancers can
                            understand your project clearly.
                        </p>

                    </div>


                    {/* Error */}
                    {error && (
                        <div className="mb-8 rounded-xl border border-red-500/25 bg-red-500/10 px-5 py-4">

                            <p className="text-sm font-medium text-red-400">
                                {typeof error === "string"
                                    ? error
                                    : JSON.stringify(error)}
                            </p>

                        </div>
                    )}


                    <form onSubmit={handleSubmit} className="space-y-8">

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
                                placeholder="e.g. Build a React website"
                                required
                                className="field"
                            />

                            <p className="mt-2 text-xs text-text-subtle">
                                Give your project a clear and specific title.
                            </p>

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
                                placeholder="Describe what you need, the goals of the project, required skills, and any important details..."
                                required
                                rows={7}
                                className="field resize-none leading-6"
                            />

                            <p className="mt-2 text-xs text-text-subtle">
                                Be as detailed as possible to attract the
                                right freelancers.
                            </p>

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

                                <option value="Sales & Lead Generation">
                                    Sales & Lead Generation
                                </option>

                                <option value="Data & Analytics">
                                    Data & Analytics
                                </option>

                                <option value="Engineering & Architecture">
                                    Engineering & Architecture
                                </option>

                                <option value="Business Consulting & Strategy">
                                    Business Consulting & Strategy
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
                                        placeholder="500"
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


                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-border pt-8 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() => navigate("/jobs")}
                                className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-text-muted transition-all duration-200 hover:border-primary/30 hover:text-text-main"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-primary px-7 py-3 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_16px_rgba(0,192,88,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Job"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default CreateJob;
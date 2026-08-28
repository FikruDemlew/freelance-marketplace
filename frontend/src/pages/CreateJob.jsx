import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="min-h-screen bg-gray-50">

            {/* Navbar */}
            <Navbar />

            {/* Page Header */}
            <section className="bg-black text-white">

                <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">

                    <div className="max-w-3xl">

                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                            For Clients
                        </p>

                        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                            Post a new job
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                            Tell talented freelancers what you need and
                            find the right person for your project.
                        </p>

                    </div>

                </div>

            </section>


            {/* Form Area */}
            <main className="mx-auto max-w-[1100px] px-6 py-12 lg:px-10 lg:py-16">

                <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm sm:p-10">

                    {/* Form Header */}
                    <div className="mb-10 border-b border-gray-100 pb-8">

                        <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                            Job information
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            Provide enough details so freelancers can
                            understand your project clearly.
                        </p>

                    </div>


                    {/* Error */}
                    {error && (
                        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-5 py-4">

                            <p className="text-sm font-medium text-red-700">
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
                                className="mb-2 block text-sm font-semibold text-gray-900"
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
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:bg-white focus:ring-2 focus:ring-gray-950/10"
                            />

                            <p className="mt-2 text-xs text-gray-400">
                                Give your project a clear and specific title.
                            </p>

                        </div>


                        {/* Description */}
                        <div>

                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-semibold text-gray-900"
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
                                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm leading-6 text-gray-900 outline-none transition focus:border-gray-950 focus:bg-white focus:ring-2 focus:ring-gray-950/10"
                            />

                            <p className="mt-2 text-xs text-gray-400">
                                Be as detailed as possible to attract the
                                right freelancers.
                            </p>

                        </div>


                        {/* Category */}
                        <div>

                            <label
                                htmlFor="category"
                                className="mb-2 block text-sm font-semibold text-gray-900"
                            >
                                Category
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:bg-white focus:ring-2 focus:ring-gray-950/10"
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
                                
                                <option value="Data Science">
                                    Data Science
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
                                    className="mb-2 block text-sm font-semibold text-gray-900"
                                >
                                    Budget
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
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
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-9 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:bg-white focus:ring-2 focus:ring-gray-950/10"
                                    />

                                </div>

                            </div>


                            {/* Deadline */}
                            <div>

                                <label
                                    htmlFor="deadline"
                                    className="mb-2 block text-sm font-semibold text-gray-900"
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
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:bg-white focus:ring-2 focus:ring-gray-950/10"
                                />

                            </div>

                        </div>


                        {/* Actions */}
                        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-8 sm:flex-row sm:justify-end">

                            <button
                                type="button"
                                onClick={() => navigate("/jobs")}
                                className="rounded-xl border border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-black px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
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
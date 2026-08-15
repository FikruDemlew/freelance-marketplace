import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/auth";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "client",
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
            await registerUser(formData);
            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data ||
                    "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-[1.1fr_1.4fr] bg-[#f5f7fb] text-slate-800">
            <div
                className="relative hidden lg:flex items-end justify-start overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/working.jpg')" }}
            >
                <div className="absolute inset-0 bg-slate-900/55" />

                <div className="relative z-10 max-w-md p-10 text-white">
                    <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase backdrop-blur-sm">
                        ConnectFreelance
                    </span>

                    <h1 className="mt-6 text-4xl font-bold leading-tight">
                        Start your next opportunity.
                    </h1>

                    <p className="mt-4 text-base text-slate-200">
                        Join a thriving network of clients and freelancers building exceptional work together.
                    </p>

                    <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
                        <div className="flex -space-x-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-cyan-500 text-sm font-semibold">C</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-violet-500 text-sm font-semibold">F</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-emerald-500 text-sm font-semibold">+ </span>
                        </div>
                        <p className="text-sm text-slate-100">
                            Join <span className="font-semibold text-white">10k+</span> professionals already growing here
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex min-h-screen items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:p-10">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Create account</p>
                        <h2 className="mt-3 text-3xl font-bold text-slate-900">Join ConnectFreelance</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Create your profile and start connecting with the right opportunities today.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {typeof error === "string" ? error : JSON.stringify(error)}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-slate-700">
                                Username
                            </label>
                            <input
                                id="username"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <input
                                id="password"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium text-slate-700">
                                Account Type
                            </label>
                            <select
                                id="role"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="client">Client</option>
                                <option value="freelancer">Freelancer</option>
                            </select>
                        </div>

                        <button
                            className="w-full rounded-full bg-cyan-800 px-4 py-3 text-base font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Register"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link className="font-semibold text-cyan-700 hover:text-cyan-800" to="/login">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
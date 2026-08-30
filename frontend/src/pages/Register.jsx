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
        setFormData({ ...formData, [name]: value });
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
        <div className="grid min-h-screen bg-background text-text-main lg:grid-cols-[1.1fr_1.4fr]">

            {/* Left panel — hero image */}
            <div
                className="relative hidden lg:flex items-end justify-start overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: "url('/working.jpg')" }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-transparent" />

                <div className="relative z-10 max-w-md p-10 pb-12 text-white">
                    <Link to="/" className="inline-flex items-center gap-2 group">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-[#07130c] transition-all duration-200 group-hover:shadow-[0_0_14px_rgba(0,192,88,0.5)]">↗</span>
                        <span className="font-display text-lg font-bold text-white">Freelance<span className="text-primary">Hub</span></span>
                    </Link>

                    <h1 className="mt-8 font-display text-4xl font-bold leading-tight tracking-tight">
                        Start your next opportunity.
                    </h1>

                    <p className="mt-4 text-base leading-7 text-slate-300">
                        Join a thriving network of clients and freelancers building exceptional work together.
                    </p>

                    <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur-sm">
                        <div className="flex -space-x-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-primary text-sm font-bold text-[#07130c]">C</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-violet-500 text-sm font-semibold text-white">F</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-blue-500 text-sm font-semibold text-white">+</span>
                        </div>
                        <p className="text-sm text-slate-200">
                            Join <span className="font-semibold text-white">10k+</span> professionals already growing here
                        </p>
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex min-h-screen items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-[#07130c]">↗</span>
                        <span className="font-display text-lg font-bold text-text-main">Freelance<span className="text-primary">Hub</span></span>
                    </Link>

                    <div className="mb-8">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Create account</p>
                        <h2 className="mt-3 font-display text-3xl font-bold text-text-main">Join FreelanceHub</h2>
                        <p className="mt-2 text-sm text-text-muted">
                            Create your profile and start connecting with the right opportunities today.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {typeof error === "string" ? error : JSON.stringify(error)}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-semibold text-text-main">
                                Username
                            </label>
                            <input
                                id="username"
                                className="field"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-text-main">
                                Email address
                            </label>
                            <input
                                id="email"
                                className="field"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-text-main">
                                Password
                            </label>
                            <input
                                id="password"
                                className="field"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a strong password"
                                required
                            />
                        </div>

                        {/* Account type — visual role cards */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main">
                                Account Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: "client", label: "Client", desc: "I want to hire", icon: "💼" },
                                    { value: "freelancer", label: "Freelancer", desc: "I want to work", icon: "💻" },
                                ].map((opt) => (
                                    <label
                                        key={opt.value}
                                        className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition-all duration-200 ${
                                            formData.role === opt.value
                                                ? "border-primary/50 bg-primary/8 shadow-[0_0_12px_rgba(0,192,88,0.12)]"
                                                : "border-border bg-surface-hover hover:border-border-subtle hover:bg-surface-elevated"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={opt.value}
                                            checked={formData.role === opt.value}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className="text-xl">{opt.icon}</span>
                                        <span className="text-sm font-semibold text-text-main">{opt.label}</span>
                                        <span className="text-xs text-text-muted">{opt.desc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            className="mt-1 w-full rounded-full bg-primary px-4 py-3 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(0,192,88,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Creating account…" : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-text-muted">
                        Already have an account?{" "}
                        <Link className="font-semibold text-primary transition-colors hover:text-primary-hover" to="/login">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../api/auth";
import { useAuth } from "../context/useAuth";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { refreshUser } = useAuth();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(formData);

            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            await refreshUser();
            navigate("/jobs");
        } catch (error) {
            console.error("Login error:", error);
            setError(
                error.response?.data?.error ||
                    error.message ||
                    "Login failed. Please check your credentials."
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
                        Build better work relationships.
                    </h1>

                    <p className="mt-4 text-base leading-7 text-slate-300">
                        Discover top freelance talent and high-impact projects in one trusted marketplace.
                    </p>

                    <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/12 bg-white/6 p-4 backdrop-blur-sm">
                        <div className="flex -space-x-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-primary text-sm font-bold text-[#07130c]">A</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-violet-500 text-sm font-semibold text-white">J</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-blue-500 text-sm font-semibold text-white">M</span>
                        </div>
                        <p className="text-sm text-slate-200">
                            Trusted by <span className="font-semibold text-white">5,000+</span> clients and freelancers
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
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Welcome back</p>
                        <h2 className="mt-3 font-display text-3xl font-bold text-text-main">Login to your account</h2>
                        <p className="mt-2 text-sm text-text-muted">
                            Find top freelancers and projects with ease.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
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
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="text-sm font-semibold text-text-main">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-xs font-medium text-primary transition-colors hover:text-primary-hover">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                className="field"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <label className="flex items-center gap-2.5 text-sm text-text-muted">
                            <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
                            Remember me
                        </label>

                        <button
                            className="mt-1 w-full rounded-full bg-primary px-4 py-3 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(0,192,88,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Logging in…" : "Login"}
                        </button>

                        <div className="flex items-center gap-3 text-text-subtle">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-xs font-medium uppercase tracking-[0.18em]">or</span>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        <button
                            className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-surface-hover px-4 py-3 text-sm font-semibold text-text-main transition-all duration-200 hover:border-primary/30 hover:bg-surface-elevated disabled:opacity-50"
                            type="button"
                            disabled={loading}
                        >
                            <img src="/google.png" alt="Google" className="h-5 w-5" />
                            Continue with Google
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-text-muted">
                        Don&apos;t have an account?{" "}
                        <Link className="font-semibold text-primary transition-colors hover:text-primary-hover" to="/register">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
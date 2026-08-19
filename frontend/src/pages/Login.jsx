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
                        Build better work relationships.
                    </h1>

                    <p className="mt-4 text-base text-slate-200">
                        Discover top freelance talent and high-impact projects in one trusted marketplace.
                    </p>

                    <div className="mt-8 flex items-center gap-4 rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
                        <div className="flex -space-x-2">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-cyan-500 text-sm font-semibold">A</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-violet-500 text-sm font-semibold">J</span>
                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-emerald-500 text-sm font-semibold">M</span>
                        </div>
                        <p className="text-sm text-slate-100">
                            Trusted by <span className="font-semibold text-white">5,000+</span> clients and freelancers
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex min-h-screen items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-lg rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_25px_60px_rgba(15,23,42,0.12)] sm:p-10">
                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Welcome back</p>
                        <h2 className="mt-3 text-3xl font-bold text-slate-900">Login to your account</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Find top freelancers and projects with ease. Get started in minutes.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
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
                                placeholder="Enter your username"
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
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-slate-600">
                                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-cyan-700 focus:ring-cyan-500" />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="font-medium text-cyan-700 hover:text-cyan-800">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            className="w-full rounded-full bg-cyan-800 px-4 py-3 text-base font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <div className="flex items-center gap-3 py-2 text-slate-400">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="text-xs font-medium uppercase tracking-[0.2em]">or</span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        <button
                            className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            type="button"
                            disabled={loading}
                        >
                            <img src="/google.png" alt="Google" className="h-5 w-5" />
                            Continue with Google
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Don&apos;t have an account?{" "}
                        <Link className="font-semibold text-cyan-700 hover:text-cyan-800" to="/register">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
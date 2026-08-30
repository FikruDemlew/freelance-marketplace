import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";

function Navbar({ landing = false }) {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const navLink = (to, label) => {
        const active = location.pathname === to;
        return (
            <Link
                to={to}
                className={`relative text-sm font-medium transition-colors duration-200 ${
                    active
                        ? "text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-primary"
                        : "text-gray-400 hover:text-white"
                }`}
            >
                {label}
            </Link>
        );
    };

    return (
        <nav
            className={`relative z-50 border-b text-white ${
                landing
                    ? "border-white/8 bg-transparent"
                    : "border-border bg-ink/95 backdrop-blur-xl"
            }`}
        >
            <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 sm:px-6 lg:px-10">

                {/* Logo */}
                <Link
                    to="/jobs"
                    className="group flex items-center gap-2.5 text-white"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-[#07130c] transition-all duration-200 group-hover:shadow-[0_0_14px_rgba(0,192,88,0.5)]">
                        ↗
                    </span>
                    <span className="font-display text-[15px] font-bold tracking-tight sm:text-lg">
                        Freelance<span className="text-primary">Hub</span>
                    </span>
                </Link>

                {/* Center navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {landing ? (
                        <>
                            <a href="#talent" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Freelancers</a>
                            <a href="#how-it-works" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">How it works</a>
                            <a href="#talent" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Pricing</a>
                            <a href="#talent" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">Blog</a>
                        </>
                    ) : (
                        <>
                            {navLink("/jobs", "Find Jobs")}
                            <a href="#how-it-works" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
                                How It Works
                            </a>
                            {user?.role === "client" && navLink("/my-jobs", "My Jobs")}
                            {user?.role === "freelancer" && navLink("/my-applications", "My Applications")}
                        </>
                    )}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Theme toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        className={`${landing ? "hidden sm:flex" : "flex"} h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6 text-sm text-gray-400 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary`}
                    >
                        {theme === "dark" ? "☀" : "☾"}
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3">
                            {/* Avatar + username */}
                            <div className="hidden items-center gap-2 sm:flex">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary ring-1 ring-primary/30">
                                    {user.username?.slice(0, 1).toUpperCase()}
                                </span>
                                <span className="text-sm font-medium text-gray-300">
                                    {user.username}
                                </span>
                            </div>

                            {user.role === "client" && (
                                <Link
                                    to="/jobs/create"
                                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_14px_rgba(0,192,88,0.35)]"
                                >
                                    Post a Job
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-full px-3 py-2 text-sm font-semibold text-gray-300 transition-colors hover:text-white sm:px-4"
                            >
                                {landing ? "Login" : "Log in"}
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_14px_rgba(0,192,88,0.35)] sm:px-5"
                            >
                                {landing ? "Register" : "Get Started"}
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}

export default Navbar;

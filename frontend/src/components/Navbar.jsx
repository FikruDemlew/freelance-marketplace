import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";

function Navbar({ landing = false }) {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className={`relative z-50 border-b border-border text-white ${landing ? "bg-transparent" : "bg-ink/95 backdrop-blur"}`}>

            <div className="mx-auto flex h-20 max-w-350 items-center justify-between px-6 lg:px-10">

                {/* Logo */}
                <Link
                    to="/jobs"
                    className="flex items-center gap-2 text-white"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-black text-[#07130c]">↗</span>
                    <span className="font-display text-xl font-bold tracking-tight">
                        Freelance<span className="text-primary">Hub</span>
                    </span>
                </Link>


                {/* Navigation */}
                <div className="hidden items-center gap-10 md:flex">

                    <Link
                        to="/jobs"
                        className="text-sm font-medium text-gray-300 transition hover:text-white"
                    >
                        {landing ? "Freelancer" : "Find Jobs"}
                    </Link>

                    <a
                        href="#talent"
                        className="text-sm font-medium text-gray-300 transition hover:text-white"
                    >
                        {landing ? "Billing" : "Find Talent"}
                    </a>

                    <a
                        href="#how-it-works"
                        className="text-sm font-medium text-gray-300 transition hover:text-white"
                    >
                        {landing ? "Our services" : "How It Works"}
                    </a>

                    {landing && <a href="#talent" className="text-sm font-medium text-gray-300 transition hover:text-white">Blog</a>}

                </div>


                {/* Right side */}
                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-lg text-white transition hover:border-primary hover:text-primary"
                    >
                        {theme === "dark" ? "☀" : "☾"}
                    </button>

                    {user ? (

                        <div className="flex items-center gap-4">

                            <span className="hidden text-sm font-medium text-gray-300 sm:block">
                                {user.username}
                            </span>

                            {user.role === "client" && (
                                <>
                                    <Link
                                        to="/my-jobs"
                                        className="text-sm font-semibold text-gray-300 transition hover:text-white"
                                    >
                                        My Jobs
                                    </Link>
                                    <Link
                                        to="/jobs/create"
                                        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-[#07130c] transition hover:bg-primary-hover"
                                    >
                                        Post a Job
                                    </Link>
                                </>
                            )}

                        </div>

                    ) : (

                        <>
                            <Link
                                to="/login"
                                className="rounded-full px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:text-white"
                            >
                                {landing ? "Login" : "Log in"}
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-[#07130c] transition hover:bg-primary-hover"
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

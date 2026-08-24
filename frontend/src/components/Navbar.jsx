import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar({ landing = false }) {
    const { user } = useAuth();

    return (
        <nav className={`relative z-50 text-white ${landing ? "bg-transparent" : "border-b border-white/10 bg-black"}`}>

            <div className="mx-auto flex h-20 max-w-350 items-center justify-between px-6 lg:px-10">

                {/* Logo */}
                <Link
                    to="/jobs"
                    className="flex items-center gap-2 text-white"
                >
                    {landing && <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-lg text-black">↗</span>}
                    <span className={landing ? "font-audiowide text-sm tracking-wide" : "text-2xl font-bold tracking-tight"}>
                        {landing ? "OCEAN JOBS" : "FreelanceHub"}
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

                    {user ? (

                        <div className="flex items-center gap-4">

                            <span className="hidden text-sm font-medium text-gray-300 sm:block">
                                {user.username}
                            </span>

                            {user.role === "client" && (
                                <Link
                                    to="/jobs/create"
                                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-primary-hover"
                                >
                                    Post a Job
                                </Link>
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
                                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${landing ? "bg-primary text-black hover:bg-primary-hover" : "bg-white text-black hover:bg-gray-200"}`}
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
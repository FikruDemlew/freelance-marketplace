import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="relative z-50 border-b border-white/10 bg-black text-white">

            <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-10">

                {/* Logo */}
                <Link
                    to="/jobs"
                    className="text-2xl font-bold tracking-tight text-white"
                >
                    FreelanceHub
                </Link>


                {/* Navigation */}
                <div className="hidden items-center gap-10 md:flex">

                    <Link
                        to="/jobs"
                        className="text-sm font-medium text-gray-300 transition hover:text-white"
                    >
                        Find Jobs
                    </Link>

                    <a
                        href="#talent"
                        className="text-sm font-medium text-gray-300 transition hover:text-white"
                    >
                        Find Talent
                    </a>

                    <a
                        href="#how-it-works"
                        className="text-sm font-medium text-gray-300 transition hover:text-white"
                    >
                        How It Works
                    </a>

                </div>


                {/* Right side */}
                <div className="flex items-center gap-3">

                    {user ? (

                        <div className="flex items-center gap-4">

                            <span className="hidden text-sm font-medium text-gray-300 sm:block">
                                {user.username}
                            </span>
                            {user.role === "freelancer" && (
    <Link
        to="/my-proposals"
        className="text-sm font-medium text-gray-300 transition hover:text-white"
    >
        My Proposals
    </Link>
)}

                            {user.role === "client" && (
                                <Link
                                    to="/jobs/create"
                                    className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-amber-300"
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
                                Log in
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
                            >
                                Get Started
                            </Link>
                        </>

                    )}

                </div>

            </div>

        </nav>
    );
}

export default Navbar;
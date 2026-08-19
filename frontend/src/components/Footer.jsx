import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-white">

            <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div className="lg:col-span-2">

                        <Link
                            to="/jobs"
                            className="text-2xl font-bold tracking-tight text-gray-950"
                        >
                            FreelanceHub
                        </Link>

                        <p className="mt-4 max-w-md text-sm leading-7 text-gray-500">
                            A modern freelance marketplace connecting talented
                            professionals with clients looking for great work.
                        </p>

                    </div>


                    {/* For Freelancers */}
                    <div>

                        <h3 className="text-sm font-semibold text-gray-950">
                            For Freelancers
                        </h3>

                        <div className="mt-5 flex flex-col gap-3">

                            <Link
                                to="/jobs"
                                className="text-sm text-gray-500 transition hover:text-gray-950"
                            >
                                Find Jobs
                            </Link>

                            <Link
                                to="/register"
                                className="text-sm text-gray-500 transition hover:text-gray-950"
                            >
                                Create Account
                            </Link>

                            <Link
                                to="/login"
                                className="text-sm text-gray-500 transition hover:text-gray-950"
                            >
                                Login
                            </Link>

                        </div>

                    </div>


                    {/* For Clients */}
                    <div>

                        <h3 className="text-sm font-semibold text-gray-950">
                            For Clients
                        </h3>

                        <div className="mt-5 flex flex-col gap-3">

                            <Link
                                to="/jobs/create"
                                className="text-sm text-gray-500 transition hover:text-gray-950"
                            >
                                Post a Job
                            </Link>

                            <a
                                href="#how-it-works"
                                className="text-sm text-gray-500 transition hover:text-gray-950"
                            >
                                How It Works
                            </a>

                        </div>

                    </div>

                </div>


                {/* Bottom */}
                <div className="mt-14 flex flex-col justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">

                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} FreelanceHub. All rights reserved.
                    </p>

                    <p className="text-sm text-gray-400">
                        Built for freelancers and clients.
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;
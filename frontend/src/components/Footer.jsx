import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="border-t border-border bg-ink">

            <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div className="lg:col-span-2">

                        <Link
                            to="/jobs"
                            className="group inline-flex items-center gap-2.5"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-black text-[#07130c] transition-all duration-200 group-hover:shadow-[0_0_14px_rgba(0,192,88,0.45)]">
                                ↗
                            </span>
                            <span className="font-display text-lg font-bold tracking-tight text-white">
                                Freelance<span className="text-primary">Hub</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-md text-sm leading-7 text-text-muted">
                            A modern freelance marketplace connecting talented
                            professionals with clients looking for great work.
                        </p>

                    </div>


                    {/* For Freelancers */}
                    <div>

                        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-text-subtle">
                            For Freelancers
                        </h3>

                        <div className="mt-5 flex flex-col gap-3">

                            <Link
                                to="/jobs"
                                className="text-sm text-text-muted transition-colors duration-200 hover:text-primary"
                            >
                                Find Jobs
                            </Link>

                            <Link
                                to="/register"
                                className="text-sm text-text-muted transition-colors duration-200 hover:text-primary"
                            >
                                Create Account
                            </Link>

                            <Link
                                to="/login"
                                className="text-sm text-text-muted transition-colors duration-200 hover:text-primary"
                            >
                                Login
                            </Link>

                        </div>

                    </div>


                    {/* For Clients */}
                    <div>

                        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-text-subtle">
                            For Clients
                        </h3>

                        <div className="mt-5 flex flex-col gap-3">

                            <Link
                                to="/jobs/create"
                                className="text-sm text-text-muted transition-colors duration-200 hover:text-primary"
                            >
                                Post a Job
                            </Link>

                            <a
                                href="#how-it-works"
                                className="text-sm text-text-muted transition-colors duration-200 hover:text-primary"
                            >
                                How It Works
                            </a>

                        </div>

                    </div>

                </div>


                {/* Bottom */}
                <div className="mt-14 flex flex-col justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">

                    <p className="text-xs text-text-subtle">
                        © {new Date().getFullYear()} FreelanceHub. All rights reserved.
                    </p>

                    <p className="text-xs text-text-subtle">
                        Built for freelancers and clients worldwide.
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;
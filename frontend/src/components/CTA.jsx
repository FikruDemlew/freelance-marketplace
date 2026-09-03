import { Link } from "react-router-dom";

function CTA() {
    return (
        <section className="bg-surface">
            <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-28">

                <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-[#0e1f16] via-[#0c1510] to-[#080f0b] px-8 py-16 text-center text-white sm:px-12 lg:px-20">

                    {/* Background ambient glows */}
                    <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-primary/12 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-secondary/10 blur-3xl" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,192,88,0.10),transparent_60%)]" />

                    {/* Content */}
                    <div className="relative z-10">

                        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_rgba(0,192,88,0.9)]" />
                            Start today
                        </div>

                        <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
                            Ready to build your future?
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                            Find your next opportunity or connect with talented
                            freelancers ready to bring your ideas to life.
                        </p>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                            <Link
                                to="/jobs"
                                className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[0_0_24px_rgba(0,192,88,0.4)]"
                            >
                                Find Jobs
                            </Link>

                            <Link
                                to="/jobs/create"
                                className="rounded-full border border-white/15 bg-white/6 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white/30 hover:bg-white/10"
                            >
                                Post a Job
                            </Link>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default CTA;
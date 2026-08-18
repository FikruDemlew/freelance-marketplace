import { Link } from "react-router-dom";

function CTA() {
    return (
        <section className="bg-white">
            <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-28">

                <div className="overflow-hidden rounded-[32px] bg-gray-950 px-8 py-16 text-center text-white sm:px-12 lg:px-20">

                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                        Start today
                    </p>

                    <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                        Ready to build your future?
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                        Find your next opportunity or connect with talented
                        freelancers ready to bring your ideas to life.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                        <Link
                            to="/jobs"
                            className="rounded-xl bg-white px-7 py-4 text-sm font-semibold text-gray-950 transition hover:bg-gray-200"
                        >
                            Find Jobs
                        </Link>

                        <Link
                            to="/jobs/create"
                            className="rounded-xl border border-gray-700 px-7 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                        >
                            Post a Job
                        </Link>

                    </div>

                </div>

            </div>
        </section>
    );
}

export default CTA;
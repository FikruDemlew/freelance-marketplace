function HowItWorks() {
    const steps = [
        {
            number: "01",
            title: "Find a Job",
            description:
                "Browse freelance opportunities and find projects that match your skills, interests, and experience.",
        },
        {
            number: "02",
            title: "Submit a Proposal",
            description:
                "Tell the client why you're the right person for the project and submit your proposal.",
        },
        {
            number: "03",
            title: "Get Hired",
            description:
                "Connect with the client, agree on the project, and start building something great together.",
        },
    ];

    return (
        <section
            id="how-it-works"
            className="border-t border-gray-100 bg-gray-50"
        >
            <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-28">

                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">

                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                        Simple process
                    </p>

                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
                        How it works
                    </h2>

                    <p className="mt-5 text-base leading-7 text-gray-500 sm:text-lg">
                        Getting started is simple. Find the right opportunity,
                        connect with clients, and grow your freelance career.
                    </p>

                </div>


                {/* Steps */}
                <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">

                    {steps.map((step) => (

                        <div
                            key={step.number}
                            className="group rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >

                            {/* Number */}
                            <div className="flex items-center justify-between">

                                <span className="text-sm font-bold tracking-widest text-gray-400">
                                    {step.number}
                                </span>

                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-950 text-white transition-transform duration-300 group-hover:rotate-6">
                                    →
                                </div>

                            </div>


                            {/* Title */}
                            <h3 className="mt-12 text-2xl font-bold tracking-tight text-gray-950">
                                {step.title}
                            </h3>


                            {/* Description */}
                            <p className="mt-4 text-sm leading-7 text-gray-500">
                                {step.description}
                            </p>

                        </div>

                    ))}

                </div>

            </div>
        </section>
    );
}

export default HowItWorks;
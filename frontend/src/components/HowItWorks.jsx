function HowItWorks() {
    const steps = [
        {
            number: "01",
            icon: "🔍",
            title: "Find a Job",
            description:
                "Browse freelance opportunities and find projects that match your skills, interests, and experience.",
        },
        {
            number: "02",
            icon: "✉️",
            title: "Submit a Proposal",
            description:
                "Tell the client why you're the right person for the project and submit your proposal.",
        },
        {
            number: "03",
            icon: "🚀",
            title: "Get Hired",
            description:
                "Connect with the client, agree on the project, and start building something great together.",
        },
    ];

    return (
        <section
            id="how-it-works"
            className="border-t border-border bg-surface"
        >
            <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10 lg:py-28">

                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">

                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
                        Simple process
                    </p>

                    <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-text-main md:text-5xl">
                        How it works
                    </h2>

                    <p className="mt-5 text-base leading-7 text-text-muted sm:text-lg">
                        Getting started is simple. Find the right opportunity,
                        connect with clients, and grow your freelance career.
                    </p>

                </div>

                {/* Steps */}
                <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">

                    {steps.map((step, index) => (

                        <div
                            key={step.number}
                            className="group relative overflow-hidden rounded-3xl border border-border bg-surface-hover p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_8px_32px_rgba(0,192,88,0.08)]"
                        >
                            {/* Subtle corner glow */}
                            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/6 blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            {/* Number + arrow */}
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold tracking-[0.2em] text-text-subtle">
                                    {step.number}
                                </span>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-[0_0_12px_rgba(0,192,88,0.3)]">
                                    <span className="text-sm">→</span>
                                </div>
                            </div>

                            {/* Icon */}
                            <div className="mt-8 text-3xl">{step.icon}</div>

                            {/* Title */}
                            <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-text-main">
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className="mt-3 text-sm leading-6 text-text-muted">
                                {step.description}
                            </p>

                            {/* Step connector line (not on last) */}
                            {index < steps.length - 1 && (
                                <div className="pointer-events-none absolute -right-3 top-1/2 hidden -translate-y-1/2 md:block">
                                    <div className="h-px w-6 bg-gradient-to-r from-border to-transparent" />
                                </div>
                            )}
                        </div>

                    ))}

                </div>

            </div>
        </section>
    );
}

export default HowItWorks;
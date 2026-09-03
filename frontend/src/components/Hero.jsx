function Hero({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
}) {
    const categories = [
        "All Jobs",
        "Web Development",
        "Mobile Development",
        "UI/UX Design",
        "Graphics Design",
        "Writing",
        "Data Science",
        "Other",
    ];

    return (
        <section className="relative overflow-hidden bg-ink text-white">

            {/* Background ambient glows */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-amber-500/8 to-transparent" />
            <div className="pointer-events-none absolute left-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-primary/6 blur-3xl" />

            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">

                <div className="relative flex min-h-[620px] items-center">

                    {/* LEFT CONTENT */}
                    <div className="relative z-10 w-full py-20 lg:py-28">

                        {/* Eyebrow badge */}
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-1.5 text-sm font-medium text-gray-300 backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,192,88,0.8)]" />
                            Find your next opportunity
                        </div>

                        <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                            Find work you love.
                            <span className="block bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                                Build your future.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                            Connect with clients, discover exciting freelance
                            opportunities, and grow your career with talented
                            professionals around the world.
                        </p>

                        {/* SEARCH */}
                        <div className="mt-8 flex w-full max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm sm:flex-row">

                            <div className="flex flex-1 items-center">
                                <span className="pl-5 text-xl text-gray-500">⌕</span>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search for jobs..."
                                    className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-gray-500"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    window.scrollTo({ top: 620, behavior: "smooth" })
                                }
                                className="bg-primary px-8 py-4 text-sm font-bold text-[#07130c] transition-all duration-200 hover:bg-primary-hover hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.1)]"
                            >
                                Search Jobs
                            </button>

                        </div>

                        {/* CATEGORIES */}
                        <div className="mt-5 flex max-w-3xl flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() =>
                                        setSelectedCategory(
                                            category === "All Jobs"
                                                ? ""
                                                : selectedCategory === category
                                                    ? ""
                                                    : category
                                        )
                                    }
                                    className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                        (category === "All Jobs" &&
                                            selectedCategory === "") ||
                                        selectedCategory === category
                                            ? "border-primary/60 bg-primary/15 text-primary shadow-[0_0_10px_rgba(0,192,88,0.2)]"
                                            : "border-white/10 bg-white/4 text-gray-400 hover:border-white/20 hover:bg-white/8 hover:text-gray-200"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default Hero;
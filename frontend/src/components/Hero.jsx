function Hero({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
}) {
    const categories = [
        "All Jobs",
        "Web Development",
        "Design",
        "Writing",
        "Marketing",
        "Mobile Development",
    ];

    return (
        <section className="relative overflow-hidden bg-black text-white">

            {/* Background glow */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-amber-500/10 to-transparent" />

            <div className="mx-auto max-w-[1400px] px-6 lg:px-10">

                <div className="relative flex min-h-[650px] items-center">

                    {/* LEFT CONTENT */}
                    <div className="relative z-10 w-full py-20 lg:py-28">

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300">
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                            Find your next opportunity
                        </div>

                        <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">

                            Find work you love.

                            <span className="block text-amber-400">
                                Build your future.
                            </span>

                        </h1>

                        <p className="mt-7 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
                            Connect with clients, discover exciting freelance
                            opportunities, and grow your career with talented
                            professionals around the world.
                        </p>

                        {/* SEARCH */}
                        <div className="mt-9 flex w-full max-w-2xl flex-col gap-2 rounded-2xl bg-white p-2 sm:flex-row">

                            <div className="flex flex-1 items-center">

                                <span className="pl-4 text-xl text-gray-400">
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    placeholder="Search for jobs..."
                                    className="min-w-0 flex-1 bg-transparent px-4 py-4 text-gray-900 outline-none placeholder:text-gray-400"
                                />

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    window.scrollTo({
                                        top: 650,
                                        behavior: "smooth",
                                    })
                                }
                                className="rounded-xl bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
                            >
                                Search Jobs
                            </button>

                        </div>

                        {/* CATEGORIES */}
                        <div className="mt-6 flex max-w-3xl flex-wrap gap-2">

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
                                    className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                                        (category === "All Jobs" &&
                                            selectedCategory === "") ||
                                        selectedCategory === category
                                            ? "border-amber-400 bg-amber-400 text-black"
                                            : "border-white/20 bg-white/5 text-gray-300 hover:border-white/50 hover:bg-white/10"
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
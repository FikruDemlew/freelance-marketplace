import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Landing() {
    return (
        <div className="min-h-screen overflow-hidden bg-[#06110a] text-white font-sans selection:bg-primary selection:text-[#06110a]">
            {/* Header */}
            <div className="absolute inset-x-0 top-0 z-40">
                <Navbar landing />
            </div>

            {/* Main Hero Section */}
            <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#06110a]">

                {/* ── BACKGROUND LAYER SYSTEM ───────────────────────────── */}
                {/* 1. Base Gradient Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(0,192,88,0.12),transparent_75%)]" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#081f14]/80 via-[#06110a]/90 to-[#06110a]" />

                {/* 2. Masked Micro-Grid Pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(0,192,88,0.20)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)]"
                />

                {/* 3. Subtle Ambient Light Orbs */}
                <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
                <div className="pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-emerald-600/8 blur-[130px]" />

                {/* 4. Thin Atmospheric Light Lines */}
                <div className="pointer-events-none absolute top-1/3 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
                <div className="pointer-events-none absolute top-2/3 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/8 to-transparent" />

                {/* 5. Bottom Vignette Transition */}
                <div className="pointer-events-none absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#06110a] via-[#06110a]/80 to-transparent z-20" />


                {/* ── HERO CONTENT STACK ────────────────────────────────── */}

                {/* BACK TEXT LAYER (Behind character image) */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-4 top-28 z-10 mx-auto max-w-7xl text-center font-display text-[clamp(2.5rem,8vw,7.8rem)] font-extrabold leading-[0.9] tracking-tight sm:inset-x-8 sm:top-36"
                >
                    <span className="block text-white drop-shadow-[0_4px_35px_rgba(0,0,0,0.7)]">
                        NEW <span className="text-primary drop-shadow-[0_0_30px_rgba(0,192,88,0.4)]">WAVE</span> IN THE
                    </span>
                    <span className="mt-2 block whitespace-nowrap text-[clamp(2rem,7.2vw,7rem)] text-white">
                        FREEL<span className="text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.85)" }}>ANCE</span> WORLD
                    </span>
                </div>

                {/* HERO BACKGROUND CHARACTER IMAGE */}
                <img
                    src="/BG2.png"
                    className="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.005]"
                    alt="Freelancer holding a tablet"
                />

                {/* FRONT TEXT LAYER & CONTENT */}
                <div className="relative z-30 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-between px-5 pb-10 pt-28 text-center sm:px-8 sm:pt-36">

                    {/* TOP BADGE & HERO CTAS */}
                    <div className="flex flex-col items-center">
                        {/* Glowing Pill Eyebrow */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-[#06110a]/80 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,192,88,0.12)]">
                            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,192,88,0.9)] animate-pulse" />
                            <span className="font-display text-xs font-bold uppercase tracking-[0.22em] text-primary">
                                The future of work
                            </span>
                        </div>

                        {/* Front duplicated stroke text layer */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-4 top-28 mx-auto max-w-7xl text-center font-display text-[clamp(2.5rem,8vw,7.8rem)] font-extrabold leading-[0.9] tracking-tight sm:inset-x-8 sm:top-36"
                        >
                            <span className="block text-transparent">
                                NEW <span className="text-transparent">WAVE</span> IN THE
                            </span>
                            <span className="mt-2 block whitespace-nowrap text-[clamp(2rem,7.2vw,7rem)] text-transparent">
                                FREEL<span className="text-transparent" style={{ WebkitTextStroke: "2px rgba(255,255,255,0.85)" }}>ANCE</span> WORLD
                            </span>
                        </div>

                        {/* HERO ACTION BUTTONS */}
                        <div className="mt-60 sm:mt-64 z-30 flex flex-wrap items-center justify-center gap-4">
                            <Link
                                to="/jobs"
                                className="rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-[#06110a] transition-all duration-300 hover:bg-primary-hover hover:shadow-[0_0_25px_rgba(0,192,88,0.4)] hover:scale-105"
                            >
                                Find Jobs →
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-full border border-white/15 bg-[#06110a]/70 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-[#06110a]/90 hover:text-primary"
                            >
                                Hire Talent
                            </Link>
                        </div>
                    </div>

                    {/* BOTTOM STATS & WIDGET CARDS ROW */}
                    <div className="w-full flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">

                        {/* LEFT STATS CARDS */}
                        <div id="talent" className="flex flex-wrap items-center gap-3 text-left">

                            {/* Freelancers stat pill */}
                            <div className="group flex items-center gap-3 rounded-full border border-white/12 bg-[#06110a]/80 px-4 py-2.5 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-primary/35 hover:bg-[#06110a]/95 hover:-translate-y-1">
                                <div className="flex -space-x-2">
                                    {[45, 12, 47, 13].map((seed) => (
                                        <img
                                            key={seed}
                                            src={`https://i.pravatar.cc/64?img=${seed}`}
                                            alt="Freelancer profile"
                                            className="h-8 w-8 rounded-full border-2 border-[#06110a] object-cover"
                                        />
                                    ))}
                                </div>
                                <div>
                                    <p className="font-display text-lg font-bold text-white leading-tight">
                                        240<span className="text-primary">+</span>
                                    </p>
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                        Freelancers
                                    </p>
                                </div>
                            </div>

                            {/* Employers stat pill */}
                            <div className="group flex items-center gap-3 rounded-full border border-white/12 bg-[#06110a]/80 px-4 py-2.5 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-primary/35 hover:bg-[#06110a]/95 hover:-translate-y-1">
                                <div className="flex -space-x-2">
                                    {[32, 14, 25, 68].map((seed) => (
                                        <img
                                            key={seed}
                                            src={`https://i.pravatar.cc/64?img=${seed}`}
                                            alt="Employer profile"
                                            className="h-8 w-8 rounded-full border-2 border-[#06110a] object-cover"
                                        />
                                    ))}
                                </div>
                                <div>
                                    <p className="font-display text-lg font-bold text-white leading-tight">
                                        1940<span className="text-primary">+</span>
                                    </p>
                                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                        Employers
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT WIDGET CARDS */}
                        <div className="hidden flex-col gap-3 text-left lg:flex">

                            {/* Live jobs widget */}
                            <div className="group w-56 rounded-2xl border border-white/12 bg-[#06110a]/85 p-3.5 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-primary/35 hover:-translate-y-1">
                                <div className="mb-1.5 flex items-center justify-between">
                                    <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                        Live Activity
                                    </span>
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_rgba(0,192,88,0.9)]" />
                                    </span>
                                </div>
                                <p className="font-display text-base font-bold text-white">
                                    6,240 active jobs
                                </p>
                                <p className="mt-0.5 text-xs text-gray-400">
                                    Design, dev & marketing
                                </p>
                            </div>

                            {/* Top picks widget */}
                            <div className="group rounded-2xl border border-primary/20 bg-[#06110a]/75 px-4 py-2.5 text-white backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-primary/45 hover:-translate-y-1">
                                <p className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                    Featured role
                                </p>
                                <p className="mt-0.5 text-xs font-semibold text-gray-200">
                                    ✨ AI Product Designer
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </section>
        </div>
    );
}

export default Landing;
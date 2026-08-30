import Navbar from '../components/Navbar'

function Landing() {
    return (
        <div className="min-h-screen overflow-hidden bg-background text-white">
            <div className="absolute inset-x-0 top-0 z-30">
            <Navbar landing />
            </div>
            <section className="relative isolate min-h-screen overflow-hidden bg-ink bg-[radial-gradient(#1d3427_2px,transparent_2px)] bg-size-[28px_28px]">
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-40 z-10 mx-auto max-w-6xl text-center font-display text-[clamp(2.8rem,7.8vw,7.5rem)] font-bold leading-[0.9] tracking-normal sm:inset-x-10 sm:top-44">
                    <span className="block">NEW <span className="text-primary">WAVE</span> IN THE</span>
                    <span className="mt-3 block whitespace-nowrap text-[clamp(2.15rem,7vw,6.8rem)]">FREEL<span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>ANCE</span> WORLD</span>
                </div>
                <img src="/BG2.png" className="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover object-center" alt="Freelancer holding a tablet" />
                <div className="relative z-30 mx-auto flex min-h-screen max-w-7xl flex-col items-center px-5 pb-12 pt-32 text-center sm:px-10 sm:pt-36">
                    <p className="font-display text-xs uppercase tracking-[0.22em] text-primary sm:text-sm">The future of work</p>
                    <div aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-40 mx-auto max-w-6xl text-center font-display text-[clamp(2.8rem,7.8vw,7.5rem)] font-bold leading-[0.9] tracking-normal sm:inset-x-10 sm:top-44">
                        <span className="block text-transparent">NEW <span className="text-transparent">WAVE</span> IN THE</span>
                        <span className="mt-3 block whitespace-nowrap text-[clamp(2.15rem,7vw,6.8rem)] text-transparent">FREEL<span className="text-transparent " style={{ WebkitTextStroke: '2px white' }}>ANCE</span> WORLD</span>
                    </div>
                   
                    <div id="talent" className="relative z-20 mt-2 flex -translate-y-4 flex-wrap items-center gap-6 text-left sm:absolute sm:left-8 sm:top-90 sm:mt-0 sm:translate-y-0 lg:left-20">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[45, 12, 47, 13].map((seed) => (
                                    <img key={seed} src={`https://i.pravatar.cc/64?img=${seed}`} alt="Freelancer profile" className="h-8 w-8 rounded-full border-2 border-[#071d13] object-cover" />
                                ))}
                            </div>
                            <div><p className="text-2xl font-bold text-white">240<span className="text-primary">+</span></p><p className="text-xs uppercase tracking-widest text-gray-400">Freelancers</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[32, 14, 25, 68].map((seed) => (
                                    <img key={seed} src={`https://i.pravatar.cc/64?img=${seed}`} alt="Employer profile" className="h-8 w-8 rounded-full border-2 border-[#071d13] object-cover" />
                                ))}
                            </div>
                            <div><p className="text-2xl font-bold text-white">1940<span className="text-primary">+</span></p><p className="text-xs uppercase tracking-widest text-gray-400">Employers</p></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Landing

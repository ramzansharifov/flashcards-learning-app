export function Hero() {
    return (
        <div>
            <section className="relative overflow-hidden">
                {/* мягкие фоновые кружочки */}
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-[#4F46E5]/20 blur-3xl" />
                    <div className="absolute -right-24 -bottom-12 h-80 w-80 rounded-full bg-[#4F46E5]/10 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* Left: text */}
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold">
                                Learn faster <br />
                                <span className="relative">
                                    <span className="relative z-10 text-[#4F46E5]">with flashcards</span>
                                    {/* лёгкая подложка-подчёркивание */}
                                    <span className="absolute inset-x-0 bottom-1 z-0 h-3 rounded bg-[#4F46E5]/15" />
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-base sm:text-lg opacity-80">
                                Create, review, and memorize information in an interactive format.
                            </p>

                            <div className="mt-14 flex flex-wrap items-center gap-3">
                                <a
                                    href="#start"
                                    className="inline-flex items-center justify-center rounded-xl bg-[#4F46E5] px-5 py-3 text-md sm:text-lg font-semibold text-white shadow-sm hover:opacity-95 active:opacity-90"
                                >
                                    Get Started
                                </a>
                                <a
                                    href="tutorial"
                                    className="inline-flex items-center justify-center rounded-xl border border-[#212529]/15 bg-white px-5 py-3 text-md sm:text-lg font-semibold hover:bg-white/70"
                                >
                                    Start Tutorial
                                </a>
                            </div>
                        </div>

                        {/* Right: иллюстрация как была */}
                        <div className="w-full flex justify-end">
                            <img src="/Hero.png" alt="" className="w-[80%]" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

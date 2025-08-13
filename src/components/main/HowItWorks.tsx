import { motion, useReducedMotion } from "framer-motion";

export function HowItWorks() {
    return (
        <div id="how-it-works" className="scroll-mt-[10vh]">
            {/* HOW IT WORKS */}
            <section className="border-y border-[#212529]/10 bg-[#F8F9FA]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-8">How It Works</h2>
                            <p className="max-w-2xl text-sm sm:text-[17px] text-[#212529]/80">
                                With this application, you can learn foreign languages, prepare for exams,
                                memorize terms, formulas, or rules, and also acquire new skills. Flashcards and
                                spaced repetition will help you retain information longer and study at a pace that’s
                                comfortable for you.
                            </p>
                        </div>

                        <OrbitViz />
                    </div>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Card 1 */}
                        <div className="rounded-xl border border-[#212529]/10 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#4F46E5] text-white">
                                    {/* grid icon */}
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                        <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
                                        <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.85" />
                                        <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.85" />
                                        <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
                                    </svg>
                                </span>
                                <div>
                                    <h3 className="text-base font-semibold">Create a workspace</h3>
                                    <p className="mt-1 text-sm opacity-80">Organize materials by category.</p>
                                </div>
                            </div>
                            <a
                                href="/dashboard"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4F46E5] hover:opacity-90"
                            >
                                Go to workspaces
                            </a>
                        </div>

                        {/* Card 2 */}
                        <div className="rounded-xl border border-[#212529]/10 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#4F46E5] text-white">
                                    {/* list icon */}
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                        <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor" />
                                        <rect x="4" y="11" width="12" height="2" rx="1" fill="currentColor" opacity="0.85" />
                                        <rect x="4" y="16" width="8" height="2" rx="1" fill="currentColor" opacity="0.7" />
                                    </svg>
                                </span>
                                <div>
                                    <h3 className="text-base font-semibold">Add topics and flashcards</h3>
                                    <p className="mt-1 text-sm opacity-80">Structure your knowledge into clear sections.</p>
                                </div>
                            </div>
                            <a
                                href="/dashboard"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4F46E5] hover:opacity-90"
                            >
                                Create a flashcard set
                            </a>
                        </div>

                        {/* Card 3 */}
                        <div className="rounded-xl border border-[#212529]/10 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#4F46E5] text-white">
                                    {/* play icon */}
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                        <path d="M8 6v12l10-6-10-6z" fill="currentColor" />
                                    </svg>
                                </span>
                                <div>
                                    <h3 className="text-base font-semibold">Start a training session</h3>
                                    <p className="mt-1 text-sm opacity-80">Practice and track your progress.</p>
                                </div>
                            </div>
                            <a
                                href="/training"
                                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#4F46E5] hover:opacity-90"
                            >
                                Start training
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/* ───────────── Decorative orbit widget ───────────── */

function OrbitViz() {
    const reduce = useReducedMotion();

    // настройки орбит
    const outer = { size: 176, radius: 88, dots: [0, 120, 240], dur: 22 };
    const inner = { size: 128, radius: 64, dots: [60, 180, 300], dur: 14 };

    return (
        <div className="me-0 md:me-8">
            <div
                className="relative h-40 w-[18rem] select-none rounded-xl border border-[#212529]/10 bg-white/80 shadow-sm backdrop-blur-sm sm:w-80"
                aria-hidden
            >
                {/* лёгкое внутреннее свечение */}
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.08),transparent_60%)]" />

                {/* центральное ядро */}
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#4F46E5] text-white shadow-md">
                        ✓
                    </div>
                </div>

                {/* внешняя орбита */}
                <Ring
                    size={outer.size}
                    radius={outer.radius}
                    dashed
                    rotate={!reduce}
                    duration={outer.dur}
                    dotAngles={outer.dots}
                />

                {/* внутренняя орбита */}
                <Ring
                    size={inner.size}
                    radius={inner.radius}
                    dashed
                    rotate={!reduce}
                    duration={inner.dur}
                    reverse
                    dotAngles={inner.dots}
                    faint
                />

                {/* подпись (маленький стек) */}
                <div className="absolute -right-3 -bottom-4 hidden items-center gap-2 rounded-xl bg-white/85 px-3 py-2 text-[12px] font-semibold text-[#212529] ring-1 ring-[#212529]/10 backdrop-blur sm:flex">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]/15 text-[#4F46E5]">↻</span>
                    Learn • Review • Repeat
                </div>
            </div>
        </div>
    );
}

function Ring({
    size,
    radius,
    dashed,
    rotate,
    reverse,
    duration,
    dotAngles,
    faint,
}: {
    size: number;
    radius: number;
    dashed?: boolean;
    rotate?: boolean;
    reverse?: boolean;
    duration: number;
    dotAngles: number[];
    faint?: boolean;
}) {
    return (
        <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: size, height: size }}
        >
            {/* окружность */}
            <div
                className={[
                    "absolute inset-0 rounded-full",
                    dashed ? "border border-dashed" : "border",
                    faint ? "border-[#4F46E5]/20" : "border-[#4F46E5]/30",
                ].join(" ")}
            />

            {/* контейнер для вращения точек */}
            <motion.div
                className="absolute inset-0"
                animate={
                    rotate
                        ? { rotate: reverse ? -360 : 360 }
                        : { rotate: 0 }
                }
                transition={{ duration, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "transform" }}
            >
                {dotAngles.map((angle, i) => (
                    <Dot key={i} angle={angle} radius={radius} faint={faint} />
                ))}
            </motion.div>
        </div>
    );
}

function Dot({ angle, radius, faint }: { angle: number; radius: number; faint?: boolean }) {
    // позиционируем точку по полярным координатам: rotate(angle) → translateX(radius)
    const style: React.CSSProperties = {
        transform: `rotate(${angle}deg) translateX(${radius}px)`,
        transformOrigin: "0 0",
    };
    return (
        <div className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%,-50%)` }}>
            <div style={style}>
                <div
                    className={[
                        "h-3 w-3 rounded-full shadow-sm",
                        faint ? "bg-[#4F46E5]/50" : "bg-[#4F46E5]",
                    ].join(" ")}
                />
            </div>
        </div>
    );
}

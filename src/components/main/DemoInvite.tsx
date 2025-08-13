import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function DemoInvite() {
    return (
        <section id="demo" className="overflow-hidden relative border-y border-[#212529]/10 bg-[#F8F9FA]">
            {/* soft background blobs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-[#4F46E5]/20 blur-3xl" />
                <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#4F46E5]/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    {/* Left: headline + description + chips + CTA */}
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[12px] font-semibold text-[#4F46E5] ring-1 ring-[#4F46E5]/20 backdrop-blur">
                            🚀 No sign-up demo
                        </div>

                        <h2 className="mt-3 text-2xl font-extrabold text-[#212529] sm:text-3xl">
                            Try a training in <span className="text-[#4F46E5]">2 minutes</span>
                        </h2>

                        <p className="mt-2 text-[17px] text-[#212529]/80 sm:text-base">
                            5 cards • progress isn’t saved. If you like it, sign in and continue with full stats
                            and spaced repetition.
                        </p>

                        {/* feature chips */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <Chip>Active recall</Chip>
                            <Chip>Spaced repetition</Chip>
                            <Chip>Flexible setup</Chip>
                            <Chip>Faster progress</Chip>
                        </div>

                        {/* CTA */}
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <a
                                href="/demo"
                                className="inline-flex text-sm sm:text-base items-center justify-center rounded-xl bg-[#4F46E5] px-5 py-3 font-semibold text-white shadow-sm hover:opacity-95 active:opacity-90"
                            >
                                Start demo training
                            </a>
                        </div>
                    </div>

                    {/* Right: mini preview (no flip) */}
                    <div className="lg:justify-self-end">
                        <PreviewStack />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ——— Helpers ——— */

function Chip({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border border-[#212529]/15 bg-white px-3 py-1 text-[12px] text-[#212529]/80">
            {children}
        </span>
    );
}

function PreviewStack() {
    return (
        <div className="relative mx-auto w-[320px] sm:w-[360px]">
            {/* stack shadow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-6 right-6 top-8 h-4 rounded-full bg-black/5 blur-[2px]" />
            </div>

            {/* Back card: QUESTION (background) */}
            <TiltCard className="absolute left-6 top-6 scale-[0.96] opacity-75" ariaHidden>
                <CardFace color="primary">What is Git?</CardFace>
            </TiltCard>

            {/* Front card: ANSWER (static) */}
            <StaticAnswerCard />
        </div>
    );
}

function TiltCard({
    children,
    className = "",
    ariaHidden = false,
}: {
    children: ReactNode;
    className?: string;
    ariaHidden?: boolean;
}) {
    return (
        <div
            className={`relative h-40 w-full select-none rounded-xl border border-[#4F46E5]/30 bg-white shadow-sm ${className}`}
            style={{ transform: "rotate(-2deg)" }}
            aria-hidden={ariaHidden || undefined}
        >
            <div className="absolute inset-0 overflow-hidden rounded-xl">{children}</div>
        </div>
    );
}

function CardFace({ children, color }: { children: ReactNode; color: "primary" | "white" }) {
    const skin =
        color === "primary"
            ? "bg-[#4F46E5] text-white"
            : "bg-white text-[#4F46E5] border border-[#4F46E5]";
    return (
        <div className={`flex h-full w-full items-center justify-center rounded-xl px-4 text-center text-base font-bold ${skin}`}>
            {children}
        </div>
    );
}

function StaticAnswerCard() {
    return (
        <motion.div
            className="relative h-40 w-full select-none rounded-xl"
            initial={{ y: 0, boxShadow: "0 8px 22px rgba(0,0,0,0.12)" }}
            whileHover={{ y: -2, boxShadow: "0 12px 28px rgba(0,0,0,0.16)" }}
            transition={{ type: "spring", stiffness: 280, damping: 24, mass: 0.7 }}
        >
            <div className="absolute inset-0 overflow-hidden rounded-xl">
                <CardFace color="white">
                    A distributed version control system for tracking changes and working with branches
                </CardFace>
            </div>
        </motion.div>
    );
}

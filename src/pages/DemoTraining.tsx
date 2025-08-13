import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTitle from "../components/ui/PageTitle";     // ← поправь путь, если нужно
import ProgressBar from "../components/ui/ProgressBar"; // ← поправь путь, если нужно
import { DemoIcon } from "../components/ui/Icons";

type Card = { front: string; back: string };

// 5 фиксированных карточек (средняя сложность)
const DEMO_CARDS: Card[] = [
    {
        front: "What does a light-year measure?",
        back: "Distance — how far light travels in one year (~9.46 trillion km), not time.",
    },
    {
        front: "Who formulated the three laws of motion?",
        back: "Isaac Newton, published in 1687 in ‘Philosophiæ Naturalis Principia Mathematica’.",
    },
    {
        front: "What gas do plants primarily absorb for photosynthesis?",
        back: "Carbon dioxide (CO₂). They use light to convert CO₂ and water into glucose; oxygen is released.",
    },
    {
        front: "Pythagorean theorem in words?",
        back: "In a right triangle, the square of the hypotenuse equals the sum of the squares of the legs.",
    },
    {
        front: "Largest internal organ of the human body?",
        back: "The liver — essential for metabolism, detoxification, and bile production.",
    },
];

type Stage = "run" | "results";

export default function DemoTraining() {
    const navigate = useNavigate();

    // demo state
    const [stage, setStage] = useState<Stage>("run");
    const [index, setIndex] = useState(0);
    const [known, setKnown] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [answering, setAnswering] = useState(false);

    const total = DEMO_CARDS.length;
    const current = useMemo(() => DEMO_CARDS[index] ?? null, [index]);

    const progress = total ? Math.round((index / total) * 100) : 0;

    const handleAnswer = async (isKnow: boolean) => {
        if (answering || !current) return;
        setAnswering(true);

        if (isKnow) setKnown((k) => k + 1);

        const atLast = index + 1 >= total;
        if (!atLast) {
            setIndex((i) => i + 1);
            setFlipped(false);
            setAnswering(false);
            return;
        }

        setStage("results");
        setAnswering(false);
    };

    const reset = () => {
        setStage("run");
        setIndex(0);
        setKnown(0);
        setFlipped(false);
        setAnswering(false);
    };

    return (
        <div className="mx-auto w-full sm:w-2xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <PageTitle
                title={stage === "run" ? "Demo training" : "Demo results"}
                subtitle={stage === "run" ? `5 cards • medium difficulty` : "How did it go?"}
                icon={<DemoIcon />}
            />

            {stage === "run" && (
                <>
                    <div className="mt-3">
                        <ProgressBar value={progress} />
                    </div>

                    {/* Карточка */}
                    {current && (
                        <div className="mt-4 rounded-xl border border-[#212529]/10 bg-white p-5 shadow-sm">
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-sm text-[#212529]/70">
                                    Card {index + 1} of {total}
                                </span>
                            </div>

                            <FlipCard
                                front={current.front}
                                back={current.back}
                                flipped={flipped}
                                setFlipped={setFlipped}
                                disabled={answering}
                            />

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => handleAnswer(false)}
                                    disabled={answering}
                                    className="flex-1 rounded-lg border border-[#212529]/15 bg-white px-4 py-2 text-sm font-semibold hover:bg-white/80 disabled:opacity-60"
                                >
                                    Don’t Know
                                </button>
                                <button
                                    onClick={() => handleAnswer(true)}
                                    disabled={answering}
                                    className="flex-1 rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 active:opacity-90 disabled:opacity-60"
                                >
                                    Know
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {stage === "results" && (
                <div className="mt-6 rounded-xl border border-[#212529]/10 bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                        {/* check icon */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold">Good job!</h2>
                    <p className="mt-1 text-sm text-[#212529]/70">
                        You knew <b>{known}</b> of <b>{total}</b> cards ({Math.round((known / total) * 100)}%).
                    </p>

                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                        <button
                            onClick={reset}
                            className="rounded-lg border border-[#212529]/15 bg-white px-4 py-2 text-sm hover:bg-white/80"
                        >
                            Try again
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 active:opacity-90"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ——————— Flip card (локальный, без внешних зависимостей кроме framer-motion) ——————— */

function FlipCard({
    front,
    back,
    flipped,
    setFlipped,
    disabled,
}: {
    front: string;
    back: string;
    flipped: boolean;
    setFlipped: (v: boolean) => void;
    disabled?: boolean;
}) {
    // авто-адаптация текста: если он длинный, выравниваем влево и включаем скролл
    const isLongFront = front.length > 110;
    const isLongBack = back.length > 110;

    return (
        <div className="flex justify-center">
            <button
                type="button"
                onClick={() => setFlipped(!flipped)}
                disabled={disabled}
                className="relative h-44 w-80 max-w-full cursor-pointer disabled:cursor-default"
                style={{ perspective: 1000 }}
            >
                <motion.div
                    className="relative h-full w-full"
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* front */}
                    <div
                        className={[
                            "absolute inset-0 flex rounded-xl bg-[#4F46E5] px-4 py-2 text-white shadow-md",
                            isLongFront ? "items-start justify-start text-left overflow-y-auto" : "items-center justify-center text-center",
                        ].join(" ")}
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <div className={isLongFront ? "text-base leading-snug" : "text-lg font-bold"}>
                            {front}
                        </div>
                    </div>

                    {/* back */}
                    <div
                        className={[
                            "absolute inset-0 flex rounded-xl border border-[#4F46E5] bg-white px-4 py-2 text-[#4F46E5] shadow-md",
                            isLongBack ? "items-start justify-start text-left overflow-y-auto" : "items-center justify-center text-center",
                        ].join(" ")}
                        style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                    >
                        <div className={isLongBack ? "text-base leading-snug" : "text-lg font-bold"}>
                            {back}
                        </div>
                    </div>
                </motion.div>
            </button>
        </div>
    );
}

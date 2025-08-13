import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../components/ui/PageTitle";
import ProgressBar from "../../components/ui/ProgressBar";
import { useCards } from "../../hooks/useCards";
import { useTopics } from "../../hooks/useTopics";
import { notify } from "../../lib/notify";
import Toggle from "../../components/ui/Toggle";
import { TrainIcon } from "../../components/ui/Icons";
import StudyFlipCard from "../../components/ui/StudyFlipCard";

type Answer = "know" | "dontKnow";

export default function TrainingRun() {
    const navigate = useNavigate();
    const { wsId, topicId } = useParams<{ wsId: string; topicId: string }>();

    const { cards, setCardResult } = useCards(wsId ?? null, topicId ?? null);
    const { updateTopicProgress } = useTopics(wsId ?? null);

    const [stage, setStage] = useState<"setup" | "run">("setup");
    const [shuffle, setShuffle] = useState(true);
    const [onlyUnknown, setOnlyUnknown] = useState(false);

    const allIds = useMemo(() => cards.map((c) => c.id), [cards]);
    const eligibleCount = useMemo(
        () => (onlyUnknown ? cards.filter((c) => c.lastResult === "dontKnow").length : cards.length),
        [cards, onlyUnknown]
    );

    const [queue, setQueue] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [answering, setAnswering] = useState(false);

    const lastAnswerByCard = useRef<Record<string, Answer | undefined>>({});
    const actionStack = useRef<{ cardId: string; prev: Answer | undefined }[]>([]);

    const currentCard = useMemo(() => {
        const id = queue[currentIndex];
        return cards.find((c) => c.id === id) || null;
    }, [queue, currentIndex, cards]);

    const progress = queue.length ? (currentIndex / queue.length) * 100 : 0;

    const start = () => {
        const ids = onlyUnknown ? cards.filter((c) => c.lastResult === "dontKnow").map((c) => c.id) : allIds;
        if (ids.length === 0) {
            notify.err(onlyUnknown ? "No unknown cards from last time." : "This topic has no cards.");
            return;
        }
        const arr = [...ids];
        if (shuffle) fisherYates(arr);
        lastAnswerByCard.current = {};
        actionStack.current = [];
        setQueue(arr);
        setCurrentIndex(0);
        setFlipped(false);
        setStage("run");
    };

    const handleAnswer = async (ans: Answer) => {
        if (answering || !queue.length || !currentCard) return;
        setAnswering(true);

        const cardId = currentCard.id;
        const prev = lastAnswerByCard.current[cardId];
        actionStack.current.push({ cardId, prev });
        lastAnswerByCard.current[cardId] = ans;
        await setCardResult(cardId, ans);

        const atLast = currentIndex + 1 >= queue.length;
        if (!atLast) {
            setCurrentIndex((i) => i + 1);
            setFlipped(false);
            setAnswering(false);
            return;
        }

        const knownNow = cards.reduce((acc, c) => {
            const final = lastAnswerByCard.current[c.id] ?? c.lastResult;
            return acc + (final === "know" ? 1 : 0);
        }, 0);
        const percent = cards.length ? Math.round((knownNow / cards.length) * 100) : 0;
        if (topicId) await updateTopicProgress(topicId, percent);
        navigate(`/training/${wsId}/${topicId}/results`, { state: { known: knownNow, total: cards.length, percent } });
    };

    const handleUndo = () => {
        if (!actionStack.current.length || currentIndex === 0) return;
        const last = actionStack.current.pop()!;
        lastAnswerByCard.current[last.cardId] = last.prev;
        setCurrentIndex((i) => i - 1);
        setFlipped(false);
    };

    return (
        <div className="mx-auto w-full max-w-7xl md:w-2xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <PageTitle
                title={stage === "setup" ? "Training setup" : "Training"}
                subtitle={
                    stage === "setup"
                        ? "Set the parameters and get started."
                        : `Card ${Math.min(currentIndex + 1, queue.length)} of ${queue.length}`
                }
                icon={
                    <TrainIcon />
                }
            />

            {stage === "run" && queue.length > 0 && (
                <div className="mt-3">
                    <ProgressBar value={Math.round(progress)} />
                </div>
            )}

            {stage === "setup" && (
                <div className="mt-4 max-w-2xl rounded-xl border border-[#212529]/10 bg-white p-5 shadow-sm">
                    <button
                        className="mb-3 text-sm font-semibold text-[#4F46E5] hover:opacity-90"
                        onClick={() => navigate("/training")}
                    >
                        ← Back
                    </button>
                    <div className="space-y-3">
                        <Toggle
                            checked={shuffle}
                            onChange={setShuffle}
                            label="Shuffle cards"
                            desc="Randomize the order of cards for this session."
                        />
                        <Toggle
                            checked={onlyUnknown}
                            onChange={setOnlyUnknown}
                            label="Only unknown from last time"
                            desc="Train only cards you marked as 'Don’t know' last time."
                        />
                        <div className="text-sm text-[#212529]/70">
                            Eligible cards: <b>{eligibleCount}</b>
                        </div>
                        <button
                            className="mt-1 inline-flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#4F46E5] px-5 py-3 text-base font-semibold text-white shadow-sm hover:opacity-95 active:opacity-90 disabled:opacity-60"
                            onClick={start}
                            disabled={eligibleCount === 0}
                        >
                            Start
                        </button>
                    </div>
                </div>
            )}

            {stage === "run" && queue.length > 0 && currentCard && (
                <div className="mt-4 max-w-2xl rounded-xl border border-[#212529]/10 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <button
                            onClick={() => navigate("/training")}
                            className="text-sm font-semibold text-[#4F46E5] hover:opacity-90"
                        >
                            ← Exit
                        </button>
                        <button
                            className="text-sm text-[#212529]/80 hover:text-[#212529] disabled:opacity-50"
                            disabled={currentIndex === 0}
                            onClick={handleUndo}
                            title="Undo"
                        >
                            ⟲ Undo
                        </button>
                    </div>

                    {/* Flip card */}
                    <div className="mb-4 flex justify-center">
                        <StudyFlipCard
                            frontText={currentCard.front}
                            backText={currentCard.back}
                            flipped={flipped}
                            onToggleFlip={() => setFlipped((f) => !f)}
                            disabled={answering}
                            className="relative h-44 w-80 sm:w-96 max-w-full focus:outline-none focus:ring-0 cursor-pointer"
                        />
                    </div>


                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAnswer("dontKnow")}
                            disabled={answering}
                            className="flex-1 cursor-pointer rounded-lg border border-[#212529]/15 bg-white px-4 py-2 text-sm font-semibold hover:bg-white/80 disabled:opacity-60"
                        >
                            Don’t Know
                        </button>
                        <button
                            onClick={() => handleAnswer("know")}
                            disabled={answering}
                            className="flex-1 cursor-pointer rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 active:opacity-90 disabled:opacity-60"
                        >
                            Know
                        </button>
                    </div>

                    <p className="mt-3 text-center text-sm text-[#212529]/70">
                        Card {currentIndex + 1} of {queue.length}
                    </p>
                </div>
            )}

            {stage === "run" && queue.length === 0 && (
                <div className="mt-4 max-w-2xl rounded-xl border border-[#212529]/10 bg-white p-5 shadow-sm">
                    <p className="text-sm">No cards to train with current filter.</p>
                    <div className="mt-3">
                        <button
                            className="rounded-lg border border-[#212529]/15 bg-white px-4 py-2 text-sm hover:bg-white/80"
                            onClick={() => setStage("setup")}
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function fisherYates<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

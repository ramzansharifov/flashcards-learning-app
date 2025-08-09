import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCards } from "../../hooks/useCards";
import { useTopics } from "../../hooks/useTopics";
import { notify } from "../../lib/notify";

type Answer = "know" | "dontKnow";

export default function TrainingRun() {
    const navigate = useNavigate();
    const { wsId, topicId } = useParams<{ wsId: string; topicId: string }>();

    const { cards, setCardResult } = useCards(wsId ?? null, topicId ?? null);
    const { updateTopicProgress } = useTopics(wsId ?? null);

    const [stage, setStage] = useState<"setup" | "run">("setup");
    const [shuffle, setShuffle] = useState(true);
    const [onlyUnknown, setOnlyUnknown] = useState(false);

    const allIds = useMemo(() => cards.map(c => c.id), [cards]);
    const eligibleCount = useMemo(
        () => (onlyUnknown ? cards.filter(c => c.lastResult === "dontKnow").length : cards.length),
        [cards, onlyUnknown]
    );

    const [queue, setQueue] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const lastAnswerByCard = useRef<Record<string, Answer | undefined>>({});
    const actionStack = useRef<{ cardId: string; prev: Answer | undefined }[]>([]);

    const currentCard = useMemo(() => {
        const id = queue[currentIndex];
        return cards.find(c => c.id === id) || null;
    }, [queue, currentIndex, cards]);

    const start = () => {
        const ids = onlyUnknown ? cards.filter(c => c.lastResult === "dontKnow").map(c => c.id) : allIds;
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
        if (!queue.length || !currentCard) return;
        const cardId = currentCard.id;
        const prev = lastAnswerByCard.current[cardId];
        actionStack.current.push({ cardId, prev });
        lastAnswerByCard.current[cardId] = ans;
        await setCardResult(cardId, ans);

        const atLast = currentIndex + 1 >= queue.length;
        if (!atLast) {
            setCurrentIndex(i => i + 1);
            setFlipped(false);
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
        setCurrentIndex(i => i - 1);
        setFlipped(false);
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            {stage === "setup" && (
                <>
                    <button className="text-sm text-blue-500 mb-2" onClick={() => navigate("/training")}>← Back</button>
                    <h1 className="text-2xl font-bold mb-3">Training setup</h1>
                    <div className="border rounded p-3 space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} />
                            <span>Shuffle cards</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={onlyUnknown} onChange={(e) => setOnlyUnknown(e.target.checked)} />
                            <span>Only unknown from last time</span>
                        </label>

                        <div className="text-sm text-gray-600">
                            Eligible cards: <b>{eligibleCount}</b>
                        </div>
                        <button className="btn btn-primary" onClick={start} disabled={eligibleCount === 0}>Start</button>
                    </div>
                </>
            )}

            {stage === "run" && queue.length > 0 && currentCard && (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <button onClick={() => navigate("/training")} className="text-sm text-blue-500">← Exit</button>
                        <button className="text-sm" disabled={currentIndex === 0} onClick={handleUndo} title="Undo">⟲ Undo</button>
                    </div>

                    <div className="p-6 border rounded mb-4 cursor-pointer select-none min-h-[120px] flex items-center justify-center text-center" onClick={() => setFlipped(f => !f)}>
                        {flipped ? currentCard.back : currentCard.front}
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => handleAnswer("dontKnow")} className="btn btn-outline flex-grow">Don’t Know</button>
                        <button onClick={() => handleAnswer("know")} className="btn btn-primary flex-grow">Know</button>
                    </div>

                    <p className="text-center mt-2">Card {currentIndex + 1} of {queue.length}</p>
                </>
            )}

            {stage === "run" && queue.length === 0 && (
                <div className="space-y-3">
                    <p>No cards to train with current filter.</p>
                    <button className="btn" onClick={() => setStage("setup")}>Back</button>
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

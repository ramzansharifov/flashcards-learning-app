import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useTopics } from "../hooks/useTopics";
import { useCards } from "../hooks/useCards";

type Stage = "selectWS" | "selectTopic" | "run" | "result";
type Answer = "know" | "dontKnow";

export default function Training() {
    const navigate = useNavigate();

    const [stage, setStage] = useState<Stage>("selectWS");
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    const [shuffle, setShuffle] = useState(true);
    const [onlyUnknown, setOnlyUnknown] = useState(false);

    const { workspaces } = useWorkspaces();
    const { topics, updateTopicProgress } = useTopics(selectedWorkspaceId);
    const { cards, setCardResult } = useCards(selectedWorkspaceId, selectedTopicId);

    const allIds = useMemo(() => cards.map(c => c.id), [cards]);

    const [queue, setQueue] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const lastAnswerByCard = useRef<Record<string, Answer | undefined>>({});
    const actionStack = useRef<{ cardId: string; prev: Answer | undefined }[]>([]);

    const currentCard = useMemo(() => {
        const id = queue[currentIndex];
        return cards.find(c => c.id === id) || null;
    }, [queue, currentIndex, cards]);

    const handleSelectWS = (id: string) => {
        setSelectedWorkspaceId(id);
        setSelectedTopicId(null);
        setStage("selectTopic");
    };

    const handleSelectTopic = (id: string) => {
        setSelectedTopicId(id);
    };

    const handleStart = () => {
        if (!selectedWorkspaceId || !selectedTopicId) return;
        const ids = onlyUnknown
            ? cards.filter(c => c.lastResult === "dontKnow").map(c => c.id)
            : allIds;
        if (shuffle) fisherYates(ids);
        lastAnswerByCard.current = {};
        actionStack.current = [];
        setQueue(ids);
        setCurrentIndex(0);
        setFlipped(false);
        setStage("run");
    };

    const handleFlip = () => setFlipped(f => !f);

    const handleAnswer = async (ans: Answer) => {
        if (!queue.length || !currentCard) return;
        const cardId = currentCard.id;
        const prev = lastAnswerByCard.current[cardId];
        actionStack.current.push({ cardId, prev });
        lastAnswerByCard.current[cardId] = ans;
        await setCardResult(cardId, ans); // пишем статус в Firestore сразу

        const atLast = currentIndex + 1 >= queue.length;
        if (!atLast) {
            setCurrentIndex(i => i + 1);
            setFlipped(false);
            return;
        }

        // считаем прогресс по всему топику: ответ из сессии перекрывает старый lastResult
        const knownNow = cards.reduce((acc, c) => {
            const final = lastAnswerByCard.current[c.id] ?? c.lastResult;
            return acc + (final === "know" ? 1 : 0);
        }, 0);
        const percent = cards.length ? Math.round((knownNow / cards.length) * 100) : 0;
        if (selectedTopicId) await updateTopicProgress(selectedTopicId, percent);
        setStage("result");
    };

    const handleUndo = () => {
        if (!actionStack.current.length || currentIndex === 0) return;
        const last = actionStack.current.pop()!;
        lastAnswerByCard.current[last.cardId] = last.prev;
        setCurrentIndex(i => i - 1);
        setFlipped(false);
    };

    const handleExitRun = () => {
        setStage("selectTopic");
        setQueue([]);
        setCurrentIndex(0);
        setFlipped(false);
        lastAnswerByCard.current = {};
        actionStack.current = [];
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            {stage === "selectWS" && (
                <>
                    <h2 className="text-xl font-bold mb-4">Select Workspace</h2>
                    <ul className="space-y-2">
                        {workspaces.map(ws => (
                            <li key={ws.id} className="p-2 border rounded hover:bg-gray-100 cursor-pointer" onClick={() => handleSelectWS(ws.id)}>
                                {ws.name}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {stage === "selectTopic" && (
                <>
                    <button onClick={() => { setStage("selectWS"); setSelectedWorkspaceId(null); setSelectedTopicId(null); }} className="text-sm text-blue-500 mb-2">← Back</button>
                    <h2 className="text-xl font-bold mb-2">Select Topic</h2>
                    <ul className="space-y-2 mb-4">
                        {topics.map(t => (
                            <li
                                key={t.id}
                                className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${selectedTopicId === t.id ? "bg-gray-100" : ""}`}
                                onClick={() => handleSelectTopic(t.id)}
                            >
                                {t.name} ({t.progress ?? 0}%)
                            </li>
                        ))}
                    </ul>

                    {selectedTopicId && (
                        <div className="border rounded p-3 space-y-3">
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} />
                                    <span>Shuffle cards</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={onlyUnknown} onChange={(e) => setOnlyUnknown(e.target.checked)} />
                                    <span>Only unknown from last time</span>
                                </label>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn-primary" onClick={handleStart}>Start Training</button>
                                <button className="btn" onClick={() => setSelectedTopicId(null)}>Change topic</button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {stage === "run" && queue.length > 0 && currentCard && (
                <>
                    <div className="flex items-center justify-between mb-2">
                        <button onClick={handleExitRun} className="text-sm text-blue-500">← Exit Training</button>
                        <button className="text-sm" disabled={currentIndex === 0} onClick={handleUndo} title="Undo">⟲ Undo</button>
                    </div>

                    <div className="p-6 border rounded mb-4 cursor-pointer select-none min-h-[120px] flex items-center justify-center text-center" onClick={handleFlip}>
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
                    <button className="btn" onClick={() => setStage("selectTopic")}>Back</button>
                </div>
            )}

            {stage === "result" && (
                <>
                    <h2 className="text-xl font-bold mb-4">Results</h2>
                    <Result ids={queue} last={lastAnswerByCard.current} />
                    <div className="mt-4 flex gap-2">
                        <button onClick={() => navigate("/training")} className="btn btn-primary">Train Another Topic</button>
                        <button onClick={() => navigate("/")} className="btn btn-outline">Back to Dashboard</button>
                    </div>
                </>
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

function computeResult(ids: string[], last: Record<string, Answer | undefined>) {
    let known = 0;
    for (const id of ids) if (last[id] === "know") known++;
    return { known, total: ids.length };
}

function Result({ ids, last }: { ids: string[]; last: Record<string, Answer | undefined> }) {
    const { known, total } = computeResult(ids, last);
    const percent = total ? Math.round((known / total) * 100) : 0;
    return <p>You knew <strong>{known}</strong> out of <strong>{total}</strong> cards (<strong>{percent}%</strong>).</p>;
}

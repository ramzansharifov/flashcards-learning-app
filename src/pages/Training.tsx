// src/pages/TrainingPage.tsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    serverTimestamp,
} from "firebase/firestore";
import { useUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

type Workspace = { id: string; name: string };
type Topic = { id: string; name: string; progress?: number };
type Card = { id: string; front: string; back: string };

export default function Training() {
    const { user } = useUser();
    const navigate = useNavigate();

    // 1. Выбор workspace и topic
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [stage, setStage] = useState<"selectWS" | "selectTopic" | "run" | "result">("selectWS");

    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    // 2. Данные карточек и прогресс
    const [cards, setCards] = useState<Card[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [knownCount, setKnownCount] = useState(0);
    const [answers, setAnswers] = useState<("know" | "dontKnow")[]>([]);

    // 3. Fetch workspaces
    useEffect(() => {
        if (!user) return;
        (async () => {
            const snap = await getDocs(collection(db, "users", user.uid, "workspaces"));
            setWorkspaces(snap.docs.map(d => ({ id: d.id, name: d.data().name })));
        })();
    }, [user]);

    // 4. Fetch topics после выбора workspace
    useEffect(() => {
        if (!user || !selectedWorkspaceId) return;
        (async () => {
            const snap = await getDocs(
                collection(db, "users", user.uid, "workspaces", selectedWorkspaceId, "topics")
            );
            setTopics(snap.docs.map(d => ({
                id: d.id,
                name: d.data().name,
                progress: d.data().progress || 0
            })));
        })();
    }, [user, selectedWorkspaceId]);

    // 5. Подгрузка карточек при начале run
    useEffect(() => {
        if (stage !== "run" || !selectedWorkspaceId || !selectedTopicId || !user) return;
        (async () => {
            const snap = await getDocs(
                collection(
                    db,
                    "users", user.uid,
                    "workspaces", selectedWorkspaceId,
                    "topics", selectedTopicId,
                    "cards"
                )
            );
            setCards(snap.docs.map(d => ({
                id: d.id,
                front: d.data().front,
                back: d.data().back,
            })));
        })();
    }, [stage, user, selectedWorkspaceId, selectedTopicId]);

    // 6. Обработчики
    const handleSelectWS = (id: string) => {
        setSelectedWorkspaceId(id);
        setStage("selectTopic");
    };

    const handleSelectTopic = (id: string) => {
        setSelectedTopicId(id);
        setStage("run");
    };

    const handleFlip = () => {
        setFlipped(prev => !prev);
    };

    const handleAnswer = (ans: "know" | "dontKnow") => {
        if (!user) return;
        setAnswers(prev => [...prev, ans]);
        if (ans === "know") setKnownCount(prev => prev + 1);
        setFlipped(false);
        if (currentIndex + 1 < cards.length) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setStage("result");
            // сохраняем прогресс
            (async () => {
                const percent = Math.round((knownCount + (ans === "know" ? 1 : 0)) / cards.length * 100);
                const topicRef = doc(
                    db,
                    "users", user.uid,
                    "workspaces", selectedWorkspaceId!,
                    "topics", selectedTopicId!
                );
                await updateDoc(topicRef, {
                    progress: percent,
                    lastTrained: serverTimestamp(),
                });
            })();
        }
    };

    const handleBack = () => {
        if (stage === "selectTopic") {
            setStage("selectWS");
            setSelectedWorkspaceId(null);
        } else if (stage === "selectWS") {
            navigate("/"); // вернуться на Dashboard
        } else {
            // выйти из тренировки на выбор тем
            setStage("selectTopic");
            setSelectedTopicId(null);
        }
    };

    // 7. UI-рендеринг по стадиям
    return (
        <div className="p-4 max-w-2xl mx-auto">
            {stage === "selectWS" && (
                <>
                    <h2 className="text-xl font-bold mb-4">Select Workspace</h2>
                    <ul className="space-y-2">
                        {workspaces.map(ws => (
                            <li
                                key={ws.id}
                                className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelectWS(ws.id)}
                            >
                                {ws.name}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {stage === "selectTopic" && (
                <>
                    <button onClick={handleBack} className="text-sm text-blue-500 mb-2">
                        ← Back
                    </button>
                    <h2 className="text-xl font-bold mb-4">Select Topic</h2>
                    <ul className="space-y-2">
                        {topics.map(t => (
                            <li
                                key={t.id}
                                className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelectTopic(t.id)}
                            >
                                {t.name} ({t.progress}%)
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {stage === "run" && cards.length > 0 && (
                <>
                    <button onClick={handleBack} className="text-sm text-blue-500 mb-2">
                        ← Exit Training
                    </button>
                    <div
                        className="p-6 border rounded mb-4 cursor-pointer select-none"
                        onClick={handleFlip}
                    >
                        {flipped ? cards[currentIndex].back : cards[currentIndex].front}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAnswer("dontKnow")}
                            className="btn btn-outline flex-grow"
                        >
                            Don’t Know
                        </button>
                        <button
                            onClick={() => handleAnswer("know")}
                            className="btn btn-primary flex-grow"
                        >
                            Know
                        </button>
                    </div>
                    <p className="text-center mt-2">
                        Card {currentIndex + 1} of {cards.length}
                    </p>
                </>
            )}

            {stage === "result" && (
                <>
                    <h2 className="text-xl font-bold mb-4">Results</h2>
                    <p>
                        You knew {knownCount} out of {cards.length} cards (
                        {Math.round((knownCount / cards.length) * 100)}%).
                    </p>
                    <button onClick={() => navigate("/training")} className="btn btn-primary mt-4">
                        Try Another Topic
                    </button>
                    <button onClick={() => navigate("/")} className="btn btn-outline mt-2">
                        Back to Dashboard
                    </button>
                </>
            )}
        </div>
    );
}

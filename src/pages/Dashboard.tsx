// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useUser } from "../hooks/useUser";

type Workspace = { id: string; name: string };
type Topic = { id: string; name: string };
type Card = { id: string; front: string; back: string };

export default function Dashboard() {
    const { user } = useUser();

    // 1. State
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [cards, setCards] = useState<Card[]>([]);

    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    const [wsName, setWsName] = useState("");
    const [topicName, setTopicName] = useState("");
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    // 2. Fetch workspaces
    useEffect(() => {
        if (!user) return;
        const fetchWorkspaces = async () => {
            const snap = await getDocs(collection(db, "users", user.uid, "workspaces"));
            setWorkspaces(snap.docs.map(d => ({ id: d.id, name: d.data().name })));
        };
        fetchWorkspaces();
    }, [user]);

    // 3. Fetch topics when a workspace selected
    useEffect(() => {
        if (!user || !selectedWorkspaceId) return;
        const fetchTopics = async () => {
            const snap = await getDocs(
                collection(db, "users", user.uid, "workspaces", selectedWorkspaceId, "topics")
            );
            setTopics(snap.docs.map(d => ({ id: d.id, name: d.data().name })));
        };
        fetchTopics();
        setSelectedTopicId(null); // сброс темы
    }, [user, selectedWorkspaceId]);

    // 4. Fetch cards when a topic selected
    useEffect(() => {
        if (!user || !selectedWorkspaceId || !selectedTopicId) return;
        const fetchCards = async () => {
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
        };
        fetchCards();
    }, [user, selectedWorkspaceId, selectedTopicId]);

    // 5. Handlers for adding
    const handleAddWorkspace = async () => {
        if (!wsName.trim() || !user) return;
        const ref = collection(db, "users", user.uid, "workspaces");
        const doc = await addDoc(ref, { name: wsName.trim() });
        setWsName("");
        setWorkspaces(prev => [...prev, { id: doc.id, name: wsName.trim() }]);
    };

    const handleAddTopic = async () => {
        if (!topicName.trim() || !user || !selectedWorkspaceId) return;
        const ref = collection(db, "users", user.uid, "workspaces", selectedWorkspaceId, "topics");
        const doc = await addDoc(ref, { name: topicName.trim() });
        setTopicName("");
        setTopics(prev => [...prev, { id: doc.id, name: topicName.trim() }]);
    };

    const handleAddCard = async () => {
        if (!front.trim() || !back.trim() || !user || !selectedWorkspaceId || !selectedTopicId) return;
        const ref = collection(
            db,
            "users", user.uid,
            "workspaces", selectedWorkspaceId,
            "topics", selectedTopicId,
            "cards"
        );
        const doc = await addDoc(ref, { front: front.trim(), back: back.trim() });
        setFront("");
        setBack("");
        setCards(prev => [...prev, { id: doc.id, front: front.trim(), back: back.trim() }]);
    };

    // 6. UI
    return (
        <div className="p-4 max-w-2xl mx-auto space-y-6">
            {/* —————— Level 1: Workspaces —————— */}
            {selectedWorkspaceId === null && (
                <>
                    <h2 className="text-2xl font-bold">Workspaces</h2>
                    <div className="flex gap-2">
                        <input
                            value={wsName}
                            onChange={e => setWsName(e.target.value)}
                            placeholder="New workspace"
                            className="input input-bordered flex-grow"
                        />
                        <button onClick={handleAddWorkspace} className="btn btn-primary">
                            Add
                        </button>
                    </div>
                    <ul className="mt-4 space-y-2">
                        {workspaces.map(ws => (
                            <li
                                key={ws.id}
                                className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                                onClick={() => setSelectedWorkspaceId(ws.id)}
                            >
                                {ws.name}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {/* —————— Level 2: Topics —————— */}
            {selectedWorkspaceId !== null && selectedTopicId === null && (
                <>
                    <button
                        className="text-sm text-blue-500 mb-2"
                        onClick={() => setSelectedWorkspaceId(null)}
                    >
                        ← Back to Workspaces
                    </button>
                    <h2 className="text-2xl font-bold">Topics</h2>
                    <div className="flex gap-2">
                        <input
                            value={topicName}
                            onChange={e => setTopicName(e.target.value)}
                            placeholder="New topic"
                            className="input input-bordered flex-grow"
                        />
                        <button onClick={handleAddTopic} className="btn btn-primary">
                            Add
                        </button>
                    </div>
                    <ul className="mt-4 space-y-2">
                        {topics.map(t => (
                            <li
                                key={t.id}
                                className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                                onClick={() => setSelectedTopicId(t.id)}
                            >
                                {t.name}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {/* —————— Level 3: Cards —————— */}
            {selectedWorkspaceId !== null && selectedTopicId !== null && (
                <>
                    <div className="flex items-center gap-4 mb-2">
                        <button
                            className="text-sm text-blue-500"
                            onClick={() => setSelectedTopicId(null)}
                        >
                            ← Back to Topics
                        </button>
                        <button
                            className="text-sm text-blue-500"
                            onClick={() => {
                                setSelectedTopicId(null);
                                setSelectedWorkspaceId(null);
                            }}
                        >
                            ← Back to Workspaces
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold">Flashcards</h2>
                    <div className="space-y-2 mb-4">
                        <input
                            value={front}
                            onChange={e => setFront(e.target.value)}
                            placeholder="Front text"
                            className="input input-bordered w-full"
                        />
                        <input
                            value={back}
                            onChange={e => setBack(e.target.value)}
                            placeholder="Back text"
                            className="input input-bordered w-full"
                        />
                        <button onClick={handleAddCard} className="btn btn-primary w-full">
                            Add Card
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {cards.map(c => (
                            <li key={c.id} className="p-2 border rounded">
                                <strong>{c.front}</strong> → {c.back}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

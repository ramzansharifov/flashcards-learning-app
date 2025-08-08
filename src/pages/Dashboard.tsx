// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useUser } from "../hooks/useUser";

import WorkspaceList from "../components/dashboard/workspace/WorkspaceList";
import TopicList from "../components/dashboard/topic/TopicList";
import CardList from "../components/dashboard/crds/CardList";

type Workspace = { id: string; name: string };
type Topic = { id: string; name: string };
type Card = { id: string; front: string; back: string };

export default function Dashboard() {
    const { user } = useUser();

    // State
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [cards, setCards] = useState<Card[]>([]);

    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    const [wsName, setWsName] = useState("");
    const [topicName, setTopicName] = useState("");
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    // Fetch workspaces
    useEffect(() => {
        if (!user) return;
        (async () => {
            const snap = await getDocs(collection(db, "users", user.uid, "workspaces"));
            setWorkspaces(snap.docs.map(d => ({ id: d.id, name: d.data().name })));
        })();
    }, [user]);

    // Fetch topics
    useEffect(() => {
        if (!user || !selectedWorkspaceId) return;
        (async () => {
            const snap = await getDocs(
                collection(db, "users", user.uid, "workspaces", selectedWorkspaceId, "topics")
            );
            setTopics(snap.docs.map(d => ({ id: d.id, name: d.data().name })));
        })();
        setSelectedTopicId(null);
    }, [user, selectedWorkspaceId]);

    // Fetch cards
    useEffect(() => {
        if (!user || !selectedWorkspaceId || !selectedTopicId) return;
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
    }, [user, selectedWorkspaceId, selectedTopicId]);

    // Handlers
    const handleAddWorkspace = async () => {
        if (!wsName.trim() || !user) return;
        const ref = collection(db, "users", user.uid, "workspaces");
        const doc = await addDoc(ref, { name: wsName.trim() });
        setWorkspaces(prev => [...prev, { id: doc.id, name: wsName.trim() }]);
        setWsName("");
    };

    const handleAddTopic = async () => {
        if (!topicName.trim() || !user || !selectedWorkspaceId) return;
        const ref = collection(db, "users", user.uid, "workspaces", selectedWorkspaceId, "topics");
        const doc = await addDoc(ref, { name: topicName.trim() });
        setTopics(prev => [...prev, { id: doc.id, name: topicName.trim() }]);
        setTopicName("");
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
        setCards(prev => [...prev, { id: doc.id, front: front.trim(), back: back.trim() }]);
        setFront("");
        setBack("");
    };

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-6">
            {selectedWorkspaceId === null ? (
                <WorkspaceList
                    workspaces={workspaces}
                    newName={wsName}
                    onNameChange={setWsName}
                    onAdd={handleAddWorkspace}
                    onSelect={setSelectedWorkspaceId}
                />
            ) : selectedTopicId === null ? (
                <TopicList
                    topics={topics}
                    newName={topicName}
                    onNameChange={setTopicName}
                    onAdd={handleAddTopic}
                    onSelect={setSelectedTopicId}
                    onBack={() => setSelectedWorkspaceId(null)}
                />
            ) : (
                <CardList
                    cards={cards}
                    front={front}
                    back={back}
                    onFrontChange={setFront}
                    onBackChange={setBack}
                    onAdd={handleAddCard}
                    onBackTopics={() => setSelectedTopicId(null)}
                    onBackWorkspaces={() => {
                        setSelectedTopicId(null);
                        setSelectedWorkspaceId(null);
                    }}
                />
            )}
        </div>
    );
}

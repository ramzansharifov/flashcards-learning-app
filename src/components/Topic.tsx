import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../hooks/useUser";

type Card = {
    id: string;
    front: string;
    back: string;
};

export default function Topic() {
    const { workspaceId, topicId } = useParams();
    const { user } = useUser();
    const [cards, setCards] = useState<Card[]>([]);
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    useEffect(() => {
        if (!user || !workspaceId || !topicId) return;

        const fetchCards = async () => {
            const snapshot = await getDocs(
                collection(
                    db,
                    "users",
                    user.uid,
                    "workspaces",
                    workspaceId,
                    "topics",
                    topicId,
                    "cards"
                )
            );
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                front: doc.data().front,
                back: doc.data().back,
            }));
            setCards(data);
        };

        fetchCards();
    }, [user, workspaceId, topicId]);

    const handleCreateCard = async () => {
        if (!front.trim() || !back.trim()) return;
        const ref = collection(
            db,
            "users",
            user.uid,
            "workspaces",
            workspaceId!,
            "topics",
            topicId!,
            "cards"
        );
        await addDoc(ref, { front, back });
        setFront("");
        setBack("");
        location.reload(); // пока просто перезагружаем страницу
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Cards</h1>

            <div className="space-y-2 mb-4">
                <input
                    type="text"
                    placeholder="Front"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    className="input input-bordered w-full"
                />
                <input
                    type="text"
                    placeholder="Back"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    className="input input-bordered w-full"
                />
                <button onClick={handleCreateCard} className="btn btn-primary w-full">
                    Add Card
                </button>
            </div>

            <ul className="space-y-2">
                {cards.map((card) => (
                    <li key={card.id} className="p-2 border rounded">
                        <strong>{card.front}</strong> → {card.back}
                    </li>
                ))}
            </ul>
        </div>
    );
}

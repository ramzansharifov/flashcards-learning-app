import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useUser } from "../hooks/useUser";

type Topic = {
    id: string;
    name: string;
};

export default function Workspace() {
    const { workspaceId } = useParams();
    const { user } = useUser();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !workspaceId) return;

        const fetchTopics = async () => {
            const snapshot = await getDocs(
                collection(db, "users", user.uid, "workspaces", workspaceId, "topics")
            );
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
            }));
            setTopics(data);
        };

        fetchTopics();
    }, [user, workspaceId]);

    const handleCreateTopic = async () => {
        if (!name.trim() || !user || !workspaceId) return;
        const ref = collection(db, "users", user.uid, "workspaces", workspaceId, "topics");
        const docRef = await addDoc(ref, { name });
        navigate(`/workspace/${workspaceId}/topic/${docRef.id}`);
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Topics</h1>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="New topic name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full"
                />
                <button onClick={handleCreateTopic} className="btn btn-primary">
                    Add
                </button>
            </div>

            <ul className="space-y-2">
                {topics.map((topic) => (
                    <li
                        key={topic.id}
                        className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate(`/workspace/${workspaceId}/topic/${topic.id}`)}
                    >
                        {topic.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

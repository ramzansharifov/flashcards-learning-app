import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import { useTopics } from "../../hooks/useTopics";

export default function TrainingHome() {
    const navigate = useNavigate();
    const [wsId, setWsId] = useState<string | null>(null);

    const { workspaces } = useWorkspaces();
    const { topics } = useTopics(wsId);

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Training</h1>

            <div>
                <h2 className="font-semibold mb-2">Choose workspace</h2>
                <ul className="space-y-2">
                    {workspaces.map(ws => (
                        <li
                            key={ws.id}
                            className={`p-2 border rounded cursor-pointer hover:bg-gray-100 ${wsId === ws.id ? "bg-gray-100" : ""}`}
                            onClick={() => setWsId(ws.id)}
                        >
                            {ws.name}
                        </li>
                    ))}
                </ul>
            </div>

            {wsId && (
                <div>
                    <h2 className="font-semibold mb-2">Choose topic</h2>
                    <ul className="space-y-2">
                        {topics.map(t => (
                            <li key={t.id} className="p-2 border rounded flex items-center justify-between">
                                <span>{t.name} ({t.progress ?? 0}%)</span>
                                <button className="btn btn-sm btn-primary" onClick={() => navigate(`/training/${wsId}/${t.id}`)}>
                                    Train
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

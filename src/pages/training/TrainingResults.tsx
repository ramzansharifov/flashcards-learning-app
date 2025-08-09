import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function TrainingResults() {
    const navigate = useNavigate();
    const { wsId, topicId } = useParams<{ wsId: string; topicId: string }>();
    const state = useLocation().state as { known?: number; total?: number; percent?: number } | null;

    const known = state?.known ?? 0;
    const total = state?.total ?? 0;
    const percent = state?.percent ?? 0;

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Results</h1>
            <p>You knew <strong>{known}</strong> of <strong>{total}</strong> cards (<strong>{percent}%</strong>).</p>
            <div className="flex gap-2">
                <button className="btn btn-primary" onClick={() => navigate(`/training/${wsId}/${topicId}`)}>Train again</button>
                <button className="btn" onClick={() => navigate("/training")}>Back to Training</button>
                <button className="btn btn-outline" onClick={() => navigate("/")}>Back to Dashboard</button>
            </div>
        </div>
    );
}

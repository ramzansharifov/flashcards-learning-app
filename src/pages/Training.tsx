import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useTopics } from "../hooks/useTopics";
import { useCards } from "../hooks/useCards";

type Stage = "selectWS" | "selectTopic" | "run" | "result";

export default function TrainingPage() {
    const navigate = useNavigate();

    // selections
    const [stage, setStage] = useState<Stage>("selectWS");
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    // data via hooks
    const { workspaces } = useWorkspaces();
    const { topics, updateTopicProgress } = useTopics(selectedWorkspaceId);
    const { cards } = useCards(selectedWorkspaceId, selectedTopicId);

    // run state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [knownCount, setKnownCount] = useState(0);

    // reset run when cards loaded
    useEffect(() => {
        if (stage === "run") {
            setCurrentIndex(0);
            setFlipped(false);
            setKnownCount(0);
        }
    }, [stage, selectedWorkspaceId, selectedTopicId]);

    const handleSelectWS = (id: string) => {
        setSelectedWorkspaceId(id);
        setStage("selectTopic");
    };

    const handleSelectTopic = (id: string) => {
        setSelectedTopicId(id);
        setStage("run");
    };

    const handleFlip = () => setFlipped(p => !p);

    const handleAnswer = async (ans: "know" | "dontKnow") => {
        const nextKnown = knownCount + (ans === "know" ? 1 : 0);

        if (currentIndex + 1 < cards.length) {
            setKnownCount(nextKnown);
            setCurrentIndex(i => i + 1);
            setFlipped(false);
            return;
        }

        // finish
        setKnownCount(nextKnown);
        setStage("result");

        // persist progress
        if (selectedWorkspaceId && selectedTopicId && cards.length > 0) {
            const percent = Math.round((nextKnown / cards.length) * 100);
            await updateTopicProgress(selectedTopicId, percent);
        }
    };

    const handleBack = () => {
        if (stage === "selectTopic") {
            setStage("selectWS");
            setSelectedWorkspaceId(null);
        } else if (stage === "selectWS") {
            navigate("/");
        } else {
            setStage("selectTopic");
            setSelectedTopicId(null);
        }
    };

    // minimal UI (same as before)
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
                                {t.name} ({t.progress ?? 0}%)
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
                    <div className="p-6 border rounded mb-4 cursor-pointer select-none" onClick={handleFlip}>
                        {flipped ? cards[currentIndex].back : cards[currentIndex].front}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleAnswer("dontKnow")} className="btn btn-outline flex-grow">
                            Don’t Know
                        </button>
                        <button onClick={() => handleAnswer("know")} className="btn btn-primary flex-grow">
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
                        {cards.length ? Math.round((knownCount / cards.length) * 100) : 0}%).
                    </p>
                    <button onClick={() => window.location.assign("/training")} className="btn btn-primary mt-4">
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

import { useState } from "react";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useTopics } from "../hooks/useTopics";
import { useCards } from "../hooks/useCards";

import WorkspaceList from "../components/dashboard/workspace/WorkspaceList";
import TopicList from "../components/dashboard/topic/TopicList";
import CardList from "../components/dashboard/crds/CardList";

export default function Dashboard() {
    // selections
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    // forms
    const [wsName, setWsName] = useState("");
    const [topicName, setTopicName] = useState("");
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    // data via hooks
    const { workspaces, addWorkspace } = useWorkspaces();
    const { topics, addTopic } = useTopics(selectedWorkspaceId);
    const { cards, addCard } = useCards(selectedWorkspaceId, selectedTopicId);

    const handleAddWorkspace = async () => {
        await addWorkspace(wsName);
        setWsName("");
    };

    const handleAddTopic = async () => {
        await addTopic(topicName);
        setTopicName("");
    };

    const handleAddCard = async () => {
        await addCard(front, back);
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

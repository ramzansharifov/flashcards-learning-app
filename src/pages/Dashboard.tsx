// src/pages/Dashboard.tsx
import { useState } from "react";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useTopics } from "../hooks/useTopics";
import { useCards } from "../hooks/useCards";
import WorkspaceList from "../components/dashboard/workspace/WorkspaceList";
import TopicList from "../components/dashboard/topic/TopicList";
import CardList from "../components/dashboard/crds/CardList";

export default function Dashboard() {
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    const [wsName, setWsName] = useState("");
    const [topicName, setTopicName] = useState("");
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");

    const {
        workspaces, loading: wsLoading, error: wsError,
        addWorkspace, updateWorkspaceName, deleteWorkspace
    } = useWorkspaces();

    const {
        topics, loading: tLoading, error: tError,
        addTopic, updateTopicName, deleteTopic
    } = useTopics(selectedWorkspaceId);

    const {
        cards,
        loading: cLoading,
        error: cError,
        addCard,
        updateCard,
        deleteCard,
    } = useCards(selectedWorkspaceId, selectedTopicId);

    const handleAddWorkspace = async () => {
        if (!wsName.trim()) return;
        await addWorkspace(wsName);
        setWsName("");
    };

    const handleAddTopic = async () => {
        if (!topicName.trim()) return;
        await addTopic(topicName);
        setTopicName("");
    };

    const handleAddCard = async () => {
        if (!front.trim() || !back.trim()) return;
        await addCard(front, back);
        setFront("");
        setBack("");
    };

    return (
        <div className="p-4 max-w-3xl mx-auto space-y-6">
            {(wsLoading || tLoading || cLoading) && (
                <div className="text-sm text-gray-500">Loading...</div>
            )}
            {(wsError || tError || cError) && (
                <div className="text-sm text-red-600">
                    {wsError || tError || cError}
                </div>
            )}

            {selectedWorkspaceId === null ? (
                <WorkspaceList
                    workspaces={workspaces}
                    newName={wsName}
                    onNameChange={setWsName}
                    onAdd={handleAddWorkspace}
                    onSelect={setSelectedWorkspaceId}
                    onRename={updateWorkspaceName}
                    onDelete={async (id) => {
                        if (selectedWorkspaceId === id) setSelectedWorkspaceId(null);
                        await deleteWorkspace(id);
                    }}
                />
            ) : selectedTopicId === null ? (
                <TopicList
                    topics={topics}
                    newName={topicName}
                    onNameChange={setTopicName}
                    onAdd={handleAddTopic}
                    onSelect={setSelectedTopicId}
                    onRename={updateTopicName}
                    onDelete={async (id) => {
                        if (selectedTopicId === id) setSelectedTopicId(null);
                        await deleteTopic(id);
                    }}
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
                    onUpdate={updateCard}
                    onDelete={deleteCard}
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

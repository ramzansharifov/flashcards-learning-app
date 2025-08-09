// src/pages/Dashboard.tsx
import { useState } from "react";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useTopics } from "../hooks/useTopics";
import { useCards } from "../hooks/useCards";
import { useNavigate } from "react-router-dom";
import WorkspaceList from "../components/dashboard/workspace/WorkspaceList";
import TopicList from "../components/dashboard/topic/TopicList";
import CardList from "../components/dashboard/crds/CardList";

export default function Dashboard() {
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const navigate = useNavigate();

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
        addCardsBulk,
        updateCard,
        deleteCard,
    } = useCards(selectedWorkspaceId, selectedTopicId);

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
                    onSelect={setSelectedWorkspaceId}
                    onAdd={addWorkspace}
                    onRename={updateWorkspaceName}
                    onDelete={async (id) => {
                        if (selectedWorkspaceId === id) setSelectedWorkspaceId(null);
                        await deleteWorkspace(id);
                    }}
                />
            ) : selectedTopicId === null ? (
                <TopicList
                    topics={topics}
                    onSelect={setSelectedTopicId}
                    onAdd={addTopic}
                    onRename={updateTopicName}
                    onDelete={async (id) => { if (selectedTopicId === id) setSelectedTopicId(null); await deleteTopic(id); }}
                    onBack={() => setSelectedWorkspaceId(null)}
                    onTrain={(topicId) => {
                        if (!selectedWorkspaceId) return;
                        navigate(`/training/${selectedWorkspaceId}/${topicId}`);
                    }}
                />
            ) : (
                <CardList
                    cards={cards}
                    onAdd={addCard}
                    onUpdate={updateCard}
                    onDelete={deleteCard}
                    onAddBulk={addCardsBulk}
                    onBackTopics={() => setSelectedTopicId(null)}
                    onBackWorkspaces={() => { setSelectedTopicId(null); setSelectedWorkspaceId(null); }}
                />
            )}
        </div>
    );
}

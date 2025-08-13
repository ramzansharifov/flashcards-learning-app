import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspaces } from "../hooks/useWorkspaces";
import { useTopics } from "../hooks/useTopics";
import { useCards } from "../hooks/useCards";

import SidebarWorkspaces from "../components/dashboard/SidebarWorkspaces";
import TopicGrid from "../components/dashboard/TopicGrid";
import CardGrid from "../components/dashboard/CardGrid";

import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import WorkspaceForm from "../components/forms/WorkspaceForm";
import TopicForm from "../components/forms/TopicForm";
import CardForm from "../components/forms/CardForm";
import CardsJsonForm from "../components/forms/CardsJsonForm";
import { DashboardIcon, FolderIcon, PlusIcon } from "../components/ui/Icons";
import PageTitle from "../components/ui/PageTitle";

type Id = string;

export default function Dashboard() {
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<Id | null>(null);
    const [selectedTopicId, setSelectedTopicId] = useState<Id | null>(null);
    const navigate = useNavigate();

    // data
    const {
        workspaces, loading: wsLoading, error: wsError,
        addWorkspace, updateWorkspaceName, deleteWorkspace
    } = useWorkspaces();

    const {
        topics, loading: tLoading, error: tError,
        addTopic, updateTopicName, deleteTopic
    } = useTopics(selectedWorkspaceId);

    const {
        cards, loading: cLoading, error: cError,
        addCard, addCardsBulk, updateCard, deleteCard
    } = useCards(selectedWorkspaceId, selectedTopicId);

    const loading = wsLoading || tLoading || cLoading;
    const error = wsError || tError || cError;

    // ui state (modals)
    const [addWsOpen, setAddWsOpen] = useState(false);
    const [editWs, setEditWs] = useState<{ id: Id; name: string } | null>(null);
    const [confirmWsDelete, setConfirmWsDelete] = useState<Id | null>(null);

    const [addTopicOpen, setAddTopicOpen] = useState(false);
    const [editTopic, setEditTopic] = useState<{ id: Id; name: string } | null>(null);
    const [confirmTopicDelete, setConfirmTopicDelete] = useState<Id | null>(null);

    const [addCardOpen, setAddCardOpen] = useState(false);
    const [importCardsOpen, setImportCardsOpen] = useState(false);
    const [editCard, setEditCard] = useState<{ id: Id; front: string; back: string } | null>(null);
    const [confirmCardDelete, setConfirmCardDelete] = useState<Id | null>(null);

    // handlers
    const onOpenWorkspace = useCallback((id: Id) => {
        setSelectedWorkspaceId(id);
        setSelectedTopicId(null);
    }, []);

    const onOpenTopic = useCallback((id: Id) => setSelectedTopicId(id), []);

    const onTrainTopic = useCallback((topicId: Id) => {
        if (!selectedWorkspaceId) return;
        navigate(`/training/${selectedWorkspaceId}/${topicId}`);
    }, [navigate, selectedWorkspaceId]);

    // ── Модальные блоки: сгруппировано по сущностям ───────────────────────────────

    const WorkspaceModals = () => (
        <>
            <Modal open={addWsOpen} title="New workspace" onClose={() => setAddWsOpen(false)} size="sm">
                <WorkspaceForm
                    submitLabel="Create"
                    onSubmit={async (name) => {
                        if (!name) return;
                        await addWorkspace(name);
                        setAddWsOpen(false);
                    }}
                />
            </Modal>

            <Modal open={!!editWs} title="Rename workspace" onClose={() => setEditWs(null)} size="sm">
                {editWs && (
                    <WorkspaceForm
                        initialName={editWs.name}
                        onSubmit={async (name) => {
                            if (!name) return;
                            await updateWorkspaceName(editWs.id, name);
                            setEditWs(null);
                        }}
                    />
                )}
            </Modal>

            <ConfirmDialog
                open={!!confirmWsDelete}
                title="Delete workspace"
                message="Are you sure you want to delete this workspace?"
                onCancel={() => setConfirmWsDelete(null)}
                onConfirm={async () => {
                    if (confirmWsDelete) {
                        if (selectedWorkspaceId === confirmWsDelete) setSelectedWorkspaceId(null);
                        await deleteWorkspace(confirmWsDelete);
                    }
                    setConfirmWsDelete(null);
                }}
            />
        </>
    );

    const TopicModals = () => (
        <>
            <Modal open={addTopicOpen} title="New topic" onClose={() => setAddTopicOpen(false)} size="sm">
                <TopicForm
                    submitLabel="Create"
                    onSubmit={async (name) => {
                        if (!name) return;
                        await addTopic(name);
                        setAddTopicOpen(false);
                    }}
                />
            </Modal>

            <Modal open={!!editTopic} title="Rename topic" onClose={() => setEditTopic(null)} size="sm">
                {editTopic && (
                    <TopicForm
                        initialName={editTopic.name}
                        onSubmit={async (name) => {
                            if (!name) return;
                            await updateTopicName(editTopic.id, name);
                            setEditTopic(null);
                        }}
                    />
                )}
            </Modal>

            <ConfirmDialog
                open={!!confirmTopicDelete}
                title="Delete topic"
                message="Are you sure you want to delete this topic?"
                onCancel={() => setConfirmTopicDelete(null)}
                onConfirm={async () => {
                    if (confirmTopicDelete) {
                        if (selectedTopicId === confirmTopicDelete) setSelectedTopicId(null);
                        await deleteTopic(confirmTopicDelete);
                    }
                    setConfirmTopicDelete(null);
                }}
            />
        </>
    );

    const CardModals = () => (
        <>
            <Modal open={addCardOpen} title="New card" onClose={() => setAddCardOpen(false)} size="sm">
                <CardForm
                    submitLabel="Create"
                    onSubmit={async (front, back) => {
                        if (!front || !back) return;
                        await addCard(front, back);
                        setAddCardOpen(false);
                    }}
                />
            </Modal>

            <Modal open={importCardsOpen} title="Import cards from JSON" onClose={() => setImportCardsOpen(false)} size="md">
                <CardsJsonForm
                    onSubmit={async (items) => {
                        await addCardsBulk(items);
                        setImportCardsOpen(false);
                    }}
                />
            </Modal>

            <Modal open={!!editCard} title="Edit card" onClose={() => setEditCard(null)} size="sm">
                {editCard && (
                    <CardForm
                        initialFront={editCard.front}
                        initialBack={editCard.back}
                        onSubmit={async (front, back) => {
                            await updateCard(editCard.id, { front, back });
                            setEditCard(null);
                        }}
                    />
                )}
            </Modal>

            <ConfirmDialog
                open={!!confirmCardDelete}
                title="Delete card"
                message="Are you sure you want to delete this card?"
                onCancel={() => setConfirmCardDelete(null)
                }
                onConfirm={async () => {
                    if (confirmCardDelete) await deleteCard(confirmCardDelete);
                    setConfirmCardDelete(null);
                }}
            />
        </>
    );

    // ── UI ─────────────────────────────────────────────────────────────────────────

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-4">
                <PageTitle
                    title="Dashboard"
                    icon={<DashboardIcon />}
                />
            </div>
            <div className="min-h-[700px] bg-white pb-6 lg:pb-8">
                <div className="mx-auto max-w-7xl grid grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8">
                    {/* Sidebar */}
                    <aside className="col-span-12 lg:col-span-3">
                        <SidebarWorkspaces
                            workspaces={workspaces}
                            loading={wsLoading}
                            selectedId={selectedWorkspaceId}
                            onAdd={() => setAddWsOpen(true)}
                            onOpen={onOpenWorkspace}
                            onRename={(id, name) => setEditWs({ id, name })}
                            onDelete={(id) => setConfirmWsDelete(id)}
                        />
                    </aside>

                    {/* Main */}
                    <main className="col-span-12 lg:col-span-9 rounded-xl border border-[#212529]/10 bg-white shadow-sm p-3 sm:p-4">
                        {loading && <div className="mb-4 text-sm text-[#212529]/70">Loading…</div>}
                        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

                        {!selectedWorkspaceId && (
                            <div className="p-8 text-center">
                                <div className="mx-auto w-full max-w-md">
                                    <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                                        <FolderIcon />
                                    </div>
                                    <h3 className="text-lg font-semibold">Create your first workspace</h3>
                                    <p className="mt-2 text-sm text-[#212529]/70">
                                        Organize topics and cards by category. It's like a project folder.
                                    </p>
                                    <div className="mt-6">
                                        <button
                                            onClick={() => setAddWsOpen(true)}
                                            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-semibold text-white hover:opacity-95 active:opacity-90"
                                        >
                                            <PlusIcon /> New Workspace
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedWorkspaceId && !selectedTopicId && (
                            <TopicGrid
                                topics={topics}
                                loading={tLoading}
                                onOpen={onOpenTopic}
                                onAdd={() => setAddTopicOpen(true)}
                                onRename={(id, name) => setEditTopic({ id, name })}
                                onDelete={(id) => setConfirmTopicDelete(id)}
                                onTrain={onTrainTopic}
                                onBackWorkspaces={() => {
                                    setSelectedWorkspaceId(null);
                                }}
                            />
                        )}

                        {selectedWorkspaceId && selectedTopicId && (
                            <CardGrid
                                cards={cards}
                                loading={cLoading}
                                onAdd={() => setAddCardOpen(true)}
                                onImport={() => setImportCardsOpen(true)}
                                onEdit={(id, front, back) => setEditCard({ id, front, back })}
                                onDelete={(id) => setConfirmCardDelete(id)}
                                onBackTopics={() => setSelectedTopicId(null)}
                                onBackWorkspaces={() => {
                                    setSelectedTopicId(null);
                                    setSelectedWorkspaceId(null);
                                }}
                            />
                        )}
                    </main>
                </div>

                <WorkspaceModals />
                <TopicModals />
                <CardModals />
            </div>
        </div>
    );
}

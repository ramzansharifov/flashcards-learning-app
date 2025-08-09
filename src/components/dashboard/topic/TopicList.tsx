import { useState } from "react";
import TopicItem from "./TopicItem";
import Modal from "../../ui/Modal";
import ConfirmDialog from "../../ui/ConfirmDialog";
import TopicForm from "../../forms/TopicForm";
import SkeletonList from "../../../ui/SkeletonList";
import { useSearch } from "../../../hooks/useSearch";

type Topic = { id: string; name: string };

type Props = {
    topics: Topic[];
    loading?: boolean;
    onSelect: (id: string) => void;
    onAdd: (name: string) => void | Promise<void>;
    onRename: (id: string, newName: string) => void | Promise<void>;
    onDelete: (id: string) => void | Promise<void>;
    onBack: () => void;
    onTrain: (id: string) => void;
};

export default function TopicList({ topics, loading, onSelect, onAdd, onRename, onDelete, onBack, onTrain }: Props) {
    const [addOpen, setAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<{ id: string; name: string } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const { q, setQ, match, isActive } = useSearch();

    return (
        <>
            <button className="text-sm text-blue-500 mb-2" onClick={onBack}>← Back to Workspaces</button>

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Topics</h2>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search..."
                    className="input input-bordered input-sm"
                />
                <button className="text-sm text-blue-600" onClick={() => setAddOpen(true)}>Add</button>
            </div>

            {loading ? (
                <SkeletonList rows={6} />
            ) : (
                <ul className="mt-4 space-y-2">
                    {(isActive ? topics.filter(t => match(t.name)) : topics).map(t => (
                        <TopicItem
                            key={t.id}
                            id={t.id}
                            name={t.name}
                            cardsCount={(t as any).cardsCount ?? 0}
                            knownCount={(t as any).knownCount ?? 0}
                            onSelect={onSelect}
                            onEdit={(id, name) => setEditTarget({ id, name })}
                            onDelete={(id) => setConfirmDeleteId(id)}
                            onTrain={onTrain}
                        />
                    ))}
                </ul>
            )}

            <Modal open={addOpen} title="New topic" onClose={() => setAddOpen(false)} footer={null}>
                <TopicForm submitLabel="Create" onSubmit={async (name) => { if (!name) return; await onAdd(name); setAddOpen(false); }} />
            </Modal>

            <Modal open={!!editTarget} title="Rename topic" onClose={() => setEditTarget(null)} footer={null}>
                {editTarget && (
                    <TopicForm
                        initialName={editTarget.name}
                        onSubmit={async (name) => { if (!name) return; await onRename(editTarget.id, name); setEditTarget(null); }}
                    />
                )}
            </Modal>

            <ConfirmDialog
                open={!!confirmDeleteId}
                title="Delete topic"
                message="Are you sure you want to delete this topic?"
                onCancel={() => setConfirmDeleteId(null)}
                onConfirm={async () => { if (confirmDeleteId) await onDelete(confirmDeleteId); setConfirmDeleteId(null); }}
            />
        </>
    );
}

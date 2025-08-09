import { useState } from "react";
import CardItem from "./CardItem";
import Modal from "../../ui/Modal";
import ConfirmDialog from "../../ui/ConfirmDialog";
import CardForm from "../../forms/CardForm";
import CardsJsonForm from "../../forms/CardsJsonForm";

type Card = { id: string; front: string; back: string };

type Props = {
    cards: Card[];
    onAdd: (front: string, back: string) => void | Promise<void>;
    onAddBulk: (items: { front: string; back: string }[]) => void | Promise<void>;
    onUpdate: (id: string, updates: { front?: string; back?: string }) => void | Promise<void>;
    onDelete: (id: string) => void | Promise<void>;
    onBackTopics: () => void;
    onBackWorkspaces: () => void;
};

export default function CardList({
    cards, onAdd, onAddBulk, onUpdate, onDelete, onBackTopics, onBackWorkspaces
}: Props) {
    const [addOpen, setAddOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<{ id: string; front: string; back: string } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    return (
        <>
            <div className="flex items-center gap-4 mb-2">
                <button className="text-sm text-blue-500" onClick={onBackTopics}>← Back to Topics</button>
                <button className="text-sm text-blue-500" onClick={onBackWorkspaces}>← Back to Workspaces</button>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Flashcards</h2>
                <div className="flex items-center gap-3">
                    <button className="text-sm text-blue-600" onClick={() => setImportOpen(true)}>Import JSON</button>
                    <button className="text-sm text-blue-600" onClick={() => setAddOpen(true)}>Add</button>
                </div>
            </div>

            <ul className="mt-4 space-y-2">
                {cards.map(c => (
                    <CardItem
                        key={c.id}
                        id={c.id}
                        front={c.front}
                        back={c.back}
                        onEdit={(id, front, back) => setEditTarget({ id, front, back })}
                        onDelete={(id) => setConfirmDeleteId(id)}
                    />
                ))}
            </ul>

            <Modal open={addOpen} title="New card" onClose={() => setAddOpen(false)} footer={null}>
                <CardForm
                    submitLabel="Create"
                    onSubmit={async (front, back) => { if (!front || !back) return; await onAdd(front, back); setAddOpen(false); }}
                />
            </Modal>

            <Modal open={importOpen} title="Import cards from JSON" onClose={() => setImportOpen(false)} footer={null}>
                <CardsJsonForm
                    onSubmit={async (items) => { await onAddBulk(items); setImportOpen(false); }}
                />
            </Modal>

            <Modal open={!!editTarget} title="Edit card" onClose={() => setEditTarget(null)} footer={null}>
                {editTarget && (
                    <CardForm
                        initialFront={editTarget.front}
                        initialBack={editTarget.back}
                        onSubmit={async (front, back) => {
                            await onUpdate(editTarget.id, { front, back });
                            setEditTarget(null);
                        }}
                    />
                )}
            </Modal>

            <ConfirmDialog
                open={!!confirmDeleteId}
                title="Delete card"
                message="Are you sure you want to delete this card?"
                onCancel={() => setConfirmDeleteId(null)}
                onConfirm={async () => { if (confirmDeleteId) await onDelete(confirmDeleteId); setConfirmDeleteId(null); }}
            />
        </>
    );
}

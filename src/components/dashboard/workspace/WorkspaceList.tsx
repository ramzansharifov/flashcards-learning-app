import { useState } from "react";
import WorkspaceItem from "./WorkspaceItem";
import Modal from "../../ui/Modal";
import ConfirmDialog from "../../ui/ConfirmDialog";
import WorkspaceForm from "../../forms/WorkspaceForm";

type Workspace = { id: string; name: string };

type Props = {
    workspaces: Workspace[];
    onSelect: (id: string) => void;
    onAdd: (name: string) => void | Promise<void>;
    onRename: (id: string, newName: string) => void | Promise<void>;
    onDelete: (id: string) => void | Promise<void>;
};

export default function WorkspaceList({ workspaces, onSelect, onAdd, onRename, onDelete }: Props) {
    const [addOpen, setAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<{ id: string; name: string } | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    return (
        <>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Workspaces</h2>
                <button className="text-sm text-blue-600" onClick={() => setAddOpen(true)}>Add</button>
            </div>

            <ul className="mt-4 space-y-2">
                {workspaces.map(ws => (
                    <WorkspaceItem
                        key={ws.id}
                        id={ws.id}
                        name={ws.name}
                        topicsCount={(ws as any).topicsCount ?? 0}
                        cardsCount={(ws as any).cardsCount ?? 0}
                        onSelect={onSelect}
                        onEdit={(id, name) => setEditTarget({ id, name })}
                        onDelete={(id) => setConfirmDeleteId(id)}
                    />
                ))}
            </ul>

            <Modal open={addOpen} title="New workspace" onClose={() => setAddOpen(false)}
                footer={null}>
                <WorkspaceForm
                    submitLabel="Create"
                    onSubmit={async (name) => { if (!name) return; await onAdd(name); setAddOpen(false); }}
                />
            </Modal>

            <Modal open={!!editTarget} title="Rename workspace" onClose={() => setEditTarget(null)} footer={null}>
                {editTarget && (
                    <WorkspaceForm
                        initialName={editTarget.name}
                        onSubmit={async (name) => { if (!name) return; await onRename(editTarget.id, name); setEditTarget(null); }}
                    />
                )}
            </Modal>

            <ConfirmDialog
                open={!!confirmDeleteId}
                title="Delete workspace"
                message="Are you sure you want to delete this workspace?"
                onCancel={() => setConfirmDeleteId(null)}
                onConfirm={async () => { if (confirmDeleteId) await onDelete(confirmDeleteId); setConfirmDeleteId(null); }}
            />
        </>
    );
}

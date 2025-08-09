import { useState } from "react";

type Props = {
    id: string;
    front: string;
    back: string;
    onUpdate: (id: string, updates: { front?: string; back?: string }) => void;
    onDelete: (id: string) => void;
};

export default function CardItem({ id, front, back, onUpdate, onDelete }: Props) {
    const [editing, setEditing] = useState(false);
    const [f, setF] = useState(front);
    const [b, setB] = useState(back);

    return (
        <li className="p-2 border rounded">
            {!editing ? (
                <div className="flex items-center justify-between">
                    <div>
                        <strong>{front}</strong> → {back}
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-xs" onClick={() => { setF(front); setB(back); setEditing(true); }}>
                            Edit
                        </button>
                        <button className="btn btn-xs btn-error" onClick={() => onDelete(id)}>
                            Delete
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <input className="input input-bordered input-sm w-full" value={f} onChange={(e) => setF(e.target.value)} />
                    <input className="input input-bordered input-sm w-full" value={b} onChange={(e) => setB(e.target.value)} />
                    <div className="flex gap-2">
                        <button className="btn btn-xs btn-primary" onClick={() => { onUpdate(id, { front: f, back: b }); setEditing(false); }}>
                            Save
                        </button>
                        <button className="btn btn-xs" onClick={() => setEditing(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </li>
    );
}

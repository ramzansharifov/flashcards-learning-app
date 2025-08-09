import { useState } from "react";

type Props = {
    id: string;
    name: string;
    onSelect: (id: string) => void;
    onRename: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
};

export default function WorkspaceItem({ id, name, onSelect, onRename, onDelete }: Props) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(name);

    return (
        <li className="p-2 border rounded hover:bg-gray-100">
            {!editing ? (
                <div className="flex items-center justify-between">
                    <span className="cursor-pointer" onClick={() => onSelect(id)}>{name}</span>
                    <div className="flex gap-2">
                        <button className="btn btn-xs" onClick={() => { setValue(name); setEditing(true); }}>
                            Edit
                        </button>
                        <button className="btn btn-xs btn-error" onClick={() => onDelete(id)}>
                            Delete
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <input
                        className="input input-bordered input-sm flex-grow"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button
                        className="btn btn-xs btn-primary"
                        onClick={() => { onRename(id, value); setEditing(false); }}
                    >
                        Save
                    </button>
                    <button className="btn btn-xs" onClick={() => setEditing(false)}>
                        Cancel
                    </button>
                </div>
            )}
        </li>
    );
}

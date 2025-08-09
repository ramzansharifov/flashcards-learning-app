import WorkspaceItem from "./WorkspaceItem";

type Workspace = { id: string; name: string };

type Props = {
    workspaces: Workspace[];
    newName: string;
    onNameChange: (s: string) => void;
    onAdd: () => void;
    onSelect: (id: string) => void;
    onRename: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
};

export default function WorkspaceList({
    workspaces, newName, onNameChange, onAdd, onSelect, onRename, onDelete
}: Props) {
    return (
        <>
            <h2 className="text-2xl font-bold">Workspaces</h2>
            <div className="flex gap-2">
                <input
                    value={newName}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="New workspace"
                    className="input input-bordered flex-grow"
                />
                <button onClick={onAdd} className="btn btn-primary">Add</button>
            </div>

            <ul className="mt-4 space-y-2">
                {workspaces.map((ws) => (
                    <WorkspaceItem
                        key={ws.id}
                        id={ws.id}
                        name={ws.name}
                        onSelect={onSelect}
                        onRename={onRename}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </>
    );
}

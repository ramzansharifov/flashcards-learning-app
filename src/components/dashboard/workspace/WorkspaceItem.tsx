type Props = {
    id: string;
    name: string;
    topicsCount?: number;
    cardsCount?: number;
    onSelect: (id: string) => void;
    onEdit: (id: string, currentName: string) => void;
    onDelete: (id: string) => void;
};

export default function WorkspaceItem({ id, name, topicsCount = 0, cardsCount = 0, onSelect, onEdit, onDelete }: Props) {
    return (
        <li className="p-2 border rounded hover:bg-gray-100">
            <div className="flex items-center justify-between">
                <span className="cursor-pointer" onClick={() => onSelect(id)}>{name}</span>
                <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100">topics: {topicsCount}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100">cards: {cardsCount}</span>
                    <button className="btn btn-xs" onClick={() => onEdit(id, name)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => onDelete(id)}>Delete</button>
                </div>
            </div>
        </li>
    );
}

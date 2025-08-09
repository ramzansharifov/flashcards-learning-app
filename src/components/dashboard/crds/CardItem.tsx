type Props = {
    id: string;
    front: string;
    back: string;
    onEdit: (id: string, front: string, back: string) => void;
    onDelete: (id: string) => void;
};

export default function CardItem({ id, front, back, onEdit, onDelete }: Props) {
    return (
        <li className="p-2 border rounded">
            <div className="flex items-center justify-between">
                <div><strong>{front}</strong> → {back}</div>
                <div className="flex gap-2">
                    <button className="btn btn-xs" onClick={() => onEdit(id, front, back)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => onDelete(id)}>Delete</button>
                </div>
            </div>
        </li>
    );
}

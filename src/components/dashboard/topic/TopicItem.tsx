// src/components/dashboard/topic/TopicItem.tsx
import { notify } from "../../../lib/notify";

type Props = {
    id: string;
    name: string;
    cardsCount?: number;
    knownCount?: number;
    onSelect: (id: string) => void;
    onEdit: (id: string, currentName: string) => void;
    onDelete: (id: string) => void;
    onTrain: (id: string) => void;
};

export default function TopicItem({
    id, name, cardsCount = 0, knownCount = 0, onSelect, onEdit, onDelete, onTrain
}: Props) {
    const handleTrain = () => {
        if (cardsCount === 0) {
            notify.err("This topic has no cards.");
            return;
        }
        onTrain(id);
    };

    return (
        <li className="p-2 border rounded hover:bg-gray-100">
            <div className="flex items-center justify-between">
                <span className="cursor-pointer" onClick={() => onSelect(id)}>{name}</span>
                <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100">cards: {cardsCount}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100">known: {knownCount}</span>
                    <button
                        className={`btn btn-xs ${cardsCount === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handleTrain}
                        title={cardsCount === 0 ? "This topic has no cards" : ""}
                    >
                        Train
                    </button>
                    <button className="btn btn-xs" onClick={() => onEdit(id, name)}>Edit</button>
                    <button className="btn btn-xs btn-error" onClick={() => onDelete(id)}>Delete</button>
                </div>
            </div>
        </li>
    );
}

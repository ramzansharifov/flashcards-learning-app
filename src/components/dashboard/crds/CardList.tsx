import CardItem from "./CardItem";

type Card = { id: string; front: string; back: string };

type Props = {
    cards: Card[];
    front: string;
    back: string;
    onFrontChange: (s: string) => void;
    onBackChange: (s: string) => void;
    onAdd: () => void;
    onUpdate: (id: string, updates: { front?: string; back?: string }) => void;
    onDelete: (id: string) => void;
    onBackTopics: () => void;
    onBackWorkspaces: () => void;
};

export default function CardList({
    cards, front, back, onFrontChange, onBackChange, onAdd, onUpdate, onDelete, onBackTopics, onBackWorkspaces
}: Props) {
    return (
        <>
            <div className="flex items-center gap-4 mb-2">
                <button className="text-sm text-blue-500" onClick={onBackTopics}>← Back to Topics</button>
                <button className="text-sm text-blue-500" onClick={onBackWorkspaces}>← Back to Workspaces</button>
            </div>

            <h2 className="text-2xl font-bold">Flashcards</h2>
            <div className="space-y-2 mb-4">
                <input
                    value={front}
                    onChange={(e) => onFrontChange(e.target.value)}
                    placeholder="Front text"
                    className="input input-bordered w-full"
                />
                <input
                    value={back}
                    onChange={(e) => onBackChange(e.target.value)}
                    placeholder="Back text"
                    className="input input-bordered w-full"
                />
                <button onClick={onAdd} className="btn btn-primary w-full">Add Card</button>
            </div>

            <ul className="space-y-2">
                {cards.map((c) => (
                    <CardItem
                        key={c.id}
                        id={c.id}
                        front={c.front}
                        back={c.back}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </>
    );
}

import TopicItem from "./TopicItem";

type Topic = { id: string; name: string };

type Props = {
    topics: Topic[];
    newName: string;
    onNameChange: (s: string) => void;
    onAdd: () => void;
    onSelect: (id: string) => void;
    onBack: () => void;
};

export default function TopicList({
    topics,
    newName,
    onNameChange,
    onAdd,
    onSelect,
    onBack,
}: Props) {
    return (
        <>
            <button
                className="text-sm text-blue-500 mb-2"
                onClick={onBack}
            >
                ← Back to Workspaces
            </button>
            <h2 className="text-2xl font-bold">Topics</h2>
            <div className="flex gap-2">
                <input
                    value={newName}
                    onChange={e => onNameChange(e.target.value)}
                    placeholder="New topic"
                    className="input input-bordered flex-grow"
                />
                <button onClick={onAdd} className="btn btn-primary">
                    Add
                </button>
            </div>
            <ul className="mt-4 space-y-2">
                {topics.map(t => (
                    <TopicItem key={t.id} id={t.id} name={t.name} onSelect={onSelect} />
                ))}
            </ul>
        </>
    );
}

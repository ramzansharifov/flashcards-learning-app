import { SkeletonGrid } from "../ui/SkeletonList";
import AddTile from "../ui/AddTile";
import { BookIcon, DeleteIcon, RenameIcon, TrainIcon } from "../ui/Icons";
import { useSearch } from "../../hooks/useSearch";

type Topic = { id: string; name: string; cardsCount?: number; knownCount?: number };

type Props = {
    topics: Topic[];
    loading?: boolean;
    onOpen: (id: string) => void;
    onAdd: () => void;
    onRename: (id: string, name: string) => void;
    onDelete: (id: string) => void;
    onTrain: (id: string) => void;
    onBackWorkspaces: () => void;
};

export default function TopicGrid({
    topics = [],
    loading,
    onOpen,
    onAdd,
    onRename,
    onDelete,
    onTrain,
    onBackWorkspaces
}: Props) {
    const { q, setQ, match, isActive } = useSearch();
    const list = isActive ? topics.filter((t) => match(t.name)) : topics;

    return (
        <section>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Topics</h2>
                    <p className="mt-1 text-sm text-[#212529]/70">
                        Select a topic to view the cards, or create a new one.
                    </p>
                </div>
                <button
                    className="rounded-lg cursor-pointer bg-[#4F46E5] px-3 py-2 text-sm font-semibold text-white hover:opacity-95 active:opacity-90"
                    onClick={onAdd}
                >
                    New Topic
                </button>
            </div>

            {/* Поле поиска */}
            <div className="mt-3">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search…"
                    className="w-full rounded-xl border border-[#212529]/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
            </div>

            {loading ? (
                <div className="mt-4"><SkeletonGrid count={6} /></div>
            ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-auto p-2">
                    <AddTile label="Add Topic" onClick={onAdd} />
                    {list.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => onOpen(t.id)}
                            className="group rounded-xl border border-[#212529]/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]/10 text-[#4F46E5]">
                                        <BookIcon />
                                    </span>
                                    <h3 className="text-base font-semibold">{t.name}</h3>
                                </div>
                                <div className="text-[11px] text-[#212529]/60">
                                    {t.cardsCount ?? 0} cards
                                </div>
                            </div>

                            <div className="mt-2 text-sm text-[#212529]/70">
                                Known: <strong>{t.knownCount ?? 0}</strong>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <button
                                    type="button"
                                    className="rounded-lg cursor-pointer bg-[#4F46E5]/10 p-2"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onTrain(t.id); }}
                                >
                                    <TrainIcon />
                                </button>
                                <button
                                    type="button"
                                    className="rounded-lg cursor-pointer bg-[#4F46E5]/10 p-2"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRename(t.id, t.name); }}
                                >
                                    <RenameIcon />
                                </button>
                                <button
                                    type="button"
                                    className="rounded-lg cursor-pointer bg-red-500/10 p-2 text-red-500"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(t.id); }}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        </button>
                    ))}
                    {list.length === 0 && (
                        <div className="col-span-full text-center text-sm text-[#212529]/60 mt-4">
                            Nothing found.
                        </div>
                    )}
                </div>
            )}
            <button
                className="text-sm font-semibold text-[#4F46E5] hover:opacity-90 mt-6"
                onClick={onBackWorkspaces}
            >
                ← Back to workspaces
            </button>
        </section>
    );
}

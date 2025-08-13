import { useState } from "react";
import { SkeletonGrid } from "../ui/SkeletonList";
import AddTile from "../ui/AddTile";
import { DeleteIcon, RenameIcon } from "../ui/Icons";
import Modal from "../ui/Modal";
import PreviewFlipCard from "../ui/PreviewFlipCard";
import { useSearch } from "../../hooks/useSearch";

type Card = { id: string; front: string; back: string };

type Props = {
    cards: Card[];
    loading?: boolean;
    onAdd: () => void;
    onImport: () => void;
    onEdit: (id: string, front: string, back: string) => void;
    onDelete: (id: string) => void;
    onBackTopics: () => void;
    onBackWorkspaces: () => void;
};

export default function CardGrid({
    cards = [],
    loading,
    onAdd,
    onImport,
    onEdit,
    onDelete,
    onBackTopics,
    onBackWorkspaces
}: Props) {
    const [preview, setPreview] = useState<Card | null>(null);
    const { q, setQ, match, isActive } = useSearch();
    const list = isActive ? cards.filter((c) => match(c.front) || match(c.back)) : cards;

    return (
        <section>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold">Cards</h2>
                    <p className="mt-1 text-sm text-[#212529]/70">
                        Click on a card to preview it. Use the icons to edit or delete
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        className="rounded-lg cursor-pointer border border-[#212529]/15 bg-white px-3 py-2 text-sm hover:bg-white/80"
                        onClick={onImport}
                    >
                        Import JSON
                    </button>
                    <button
                        className="rounded-lg cursor-pointer bg-[#4F46E5] px-3 py-2 text-sm font-semibold text-white hover:opacity-95 active:opacity-90"
                        onClick={onAdd}
                    >
                        New Card
                    </button>
                </div>
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
                <div className="mt-4"><SkeletonGrid count={8} /></div>
            ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-[600px] overflow-auto p-2">
                    <AddTile label="Add Card" onClick={onAdd} />
                    {list.map((c) => (
                        <button
                            key={c.id}
                            className="group rounded-xl border border-[#212529]/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            onClick={() => setPreview(c)}
                        >
                            <div className="text-sm font-semibold truncate">{c.front}</div>
                            <div className="mt-1 text-sm opacity-70 truncate">{c.back}</div>

                            <div className="mt-3 flex items-center justify-end gap-2">
                                <button
                                    className="rounded-lg cursor-pointer bg-[#4F46E5]/10 p-2"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(c.id, c.front, c.back); }}
                                >
                                    <RenameIcon />
                                </button>
                                <button
                                    className="rounded-lg cursor-pointer bg-red-500/10 p-2 text-red-500"
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(c.id); }}
                                >
                                    <DeleteIcon />
                                </button>
                            </div>
                        </button>
                    ))}
                    {list.length === 0 && (
                        <div className="col-span-full text-center text-sm text-[#212529]/60 mt-4">
                            Nothing found
                        </div>
                    )}
                </div>
            )}

            <div className="mt-6 flex items-center gap-3">
                <button className="text-sm font-semibold text-[#4F46E5] hover:opacity-90" onClick={onBackTopics}>
                    ← Back to topics
                </button>
                <button className="text-sm font-semibold text-[#4F46E5] hover:opacity-90" onClick={onBackWorkspaces}>
                    ← Back to workspaces
                </button>
            </div>

            <Modal
                open={!!preview}
                onClose={() => setPreview(null)}
                title="Card preview"
            >
                {preview && (
                    <PreviewFlipCard front={preview.front} back={preview.back} />
                )}
            </Modal>
        </section>
    );
}

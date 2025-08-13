import { useEffect, useRef, useState } from "react";
import SkeletonList from "../ui/SkeletonList";
import { useSearch } from "../../hooks/useSearch";
import { DeleteIcon, FolderIcon, PlusIcon, RenameIcon } from "../ui/Icons";
import MenuPortal from "../ui/MenuPortal";

type Workspace = { id: string; name: string; topicsCount?: number; cardsCount?: number };

type Props = {
    workspaces: Workspace[];
    loading?: boolean;
    selectedId: string | null;
    onAdd: () => void;
    onOpen: (id: string) => void;
    onRename: (id: string, name: string) => void;
    onDelete: (id: string) => void;
};

export default function SidebarWorkspaces({
    workspaces,
    loading,
    selectedId,
    onAdd,
    onOpen,
    onRename,
    onDelete,
}: Props) {
    const { q, setQ, match, isActive } = useSearch();
    const list = isActive ? workspaces.filter((w) => match(w.name)) : workspaces;

    // Открытое меню
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const listRef = useRef<HTMLUListElement | null>(null);

    // Закрытие по Esc
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpenId(null);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    // Закрытие по клику вне портала
    const onCloseMenu = () => {
        setMenuOpenId(null);
        setAnchorEl(null);
    };

    return (
        <div className="rounded-xl border min-h-[305px] border-[#212529]/10 bg-white shadow-sm p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Workspaces</h2>
                <button
                    className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-lg text-white bg-[#4F46E5]"
                    title="Add workspace"
                    onClick={onAdd}
                >
                    <PlusIcon />
                </button>
            </div>

            <div className="mb-3">
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search…"
                    className="w-full rounded-xl border border-[#212529]/15 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4F46E5]"
                />
            </div>

            {loading ? (
                <SkeletonList rows={6} />
            ) : (
                <ul ref={listRef} className="space-y-1 max-h-[668px] overflow-y-auto">
                    {list.map((ws) => {
                        const active = selectedId === ws.id;
                        const isMenuOpen = menuOpenId === ws.id;

                        return (
                            <li
                                key={ws.id}
                                className={`relative cursor-pointer flex items-center justify-between rounded-xl px-3 py-2 text-sm transition ${active ? "bg-[#4F46E5]/10" : "hover:bg-[#212529]/5"
                                    }`}
                                onClick={() => onOpen(ws.id)}
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <span
                                        className={`inline-flex p-1 shrink-0 items-center justify-center rounded-md ${active ? "bg-[#4F46E5] text-white" : "bg-[#212529]/10 text-[#212529]"
                                            }`}
                                    >
                                        <FolderIcon />
                                    </span>
                                    <span className="truncate font-medium">{ws.name}</span>
                                </div>

                                {/* Кнопка "три точки" */}
                                <button
                                    aria-haspopup="menu"
                                    aria-expanded={isMenuOpen}
                                    title="More"
                                    className="ml-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#212529]/15 text-[#212529] bg-white cursor-pointer hover:bg-white/50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const btn = e.currentTarget as HTMLButtonElement;
                                        setAnchorEl((prev) => (prev === btn ? prev : btn));
                                        setMenuOpenId((prev) => (prev === ws.id ? null : ws.id));
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                        <circle cx="12" cy="5" r="2" />
                                        <circle cx="12" cy="12" r="2" />
                                        <circle cx="12" cy="19" r="2" />
                                    </svg>
                                </button>

                                {/* Портальное меню — рендерим вне списка, чтобы не влиять на скролл/высоту */}
                                {isMenuOpen && anchorEl && (
                                    <MenuPortal
                                        anchorEl={anchorEl}
                                        scrollContainer={listRef.current}
                                        onClose={onCloseMenu}
                                    >
                                        <div className="mb-2 grid grid-cols-1 gap-2 text-[11px]">
                                            <div className="rounded-md bg-[#212529]/5 px-2 py-1">Topics: {ws.topicsCount ?? 0}</div>
                                            <div className="rounded-md bg-[#212529]/5 px-2 py-1">Cards: {ws.cardsCount ?? 0}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="flex-1 rounded-lg cursor-pointer bg-[#4F46E5]/10 p-2"
                                                onClick={() => {
                                                    onCloseMenu();
                                                    onRename(ws.id, ws.name);
                                                }}
                                            >
                                                <RenameIcon />
                                            </button>
                                            <button
                                                className="flex-1 rounded-lg cursor-pointer bg-red-500/10 p-2 text-red-500"
                                                onClick={() => {
                                                    onCloseMenu();
                                                    onDelete(ws.id);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </button>
                                        </div>
                                    </MenuPortal>
                                )}
                            </li>
                        );
                    })}
                    {list.length === 0 && (
                        <li className="rounded-xl border border-dashed border-[#212529]/15 p-4 text-center text-xs text-[#212529]/70">
                            Nothing found
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}

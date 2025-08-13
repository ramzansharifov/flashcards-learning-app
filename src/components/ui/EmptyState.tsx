import { PlusIcon, FolderIcon } from "./Icons";

type Props = { title: string; desc: string; actionLabel: string; onAction: () => void };

export default function EmptyState({ title, desc, actionLabel, onAction }: Props) {
    return (
        <div className="rounded-xl border border-[#212529]/10 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto w-full max-w-md">
                <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                    <FolderIcon />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-[#212529]/70">{desc}</p>
                <div className="mt-6">
                    <button
                        onClick={onAction}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3 text-sm font-semibold text-white hover:opacity-95 active:opacity-90"
                    >
                        <PlusIcon /> {actionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

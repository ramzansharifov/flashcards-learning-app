import { PlusIcon } from "./Icons";

export default function AddTile({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-full cursor-pointer min-h-[112px] items-center justify-center rounded-xl border-2 border-dashed border-[#212529]/15 bg-white/60 p-4 text-center text-sm font-semibold text-[#212529]/70 hover:bg-white hover:text-[#212529] hover:shadow-sm"
            aria-label={label}
        >
            <div className="flex flex-col items-center">
                <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5]/10 text-[#4F46E5]">
                    <PlusIcon />
                </span>
                {label}
            </div>
        </button>
    );
}

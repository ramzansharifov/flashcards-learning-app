export default function Toggle({
    checked,
    onChange,
    label,
    desc,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    desc?: string;
}) {
    return (
        <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-[#212529]/10 bg-white p-3">
            <div className="min-w-0">
                <div className="text-sm font-medium">{label}</div>
                {desc && <div className="text-xs text-[#212529]/70">{desc}</div>}
            </div>
            <span
                className={[
                    "relative inline-flex h-6 w-11 items-center rounded-full transition",
                    checked ? "bg-[#4F46E5]" : "bg-[#212529]/20",
                ].join(" ")}
                onClick={() => onChange(!checked)}
                role="switch"
                aria-checked={checked}
            >
                <span
                    className={[
                        "absolute left-1 h-4 w-4 transform rounded-full bg-white transition",
                        checked ? "translate-x-5" : "translate-x-0",
                    ].join(" ")}
                />
            </span>
        </label>
    );
}
export default function ProgressBar({ value }: { value: number }) {
    const v = Math.max(0, Math.min(100, Math.round(value)));
    return (
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#212529]/10">
            <div className="h-full rounded-full bg-[#4F46E5]" style={{ width: `${v}%` }} />
        </div>
    );
}

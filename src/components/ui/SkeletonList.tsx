import Skeleton from "./Skeleton";

export default function SkeletonList({ rows = 6 }: { rows?: number }) {
    return (
        <ul className="space-y-1">
            {Array.from({ length: rows }).map((_, i) => (
                <li
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-[#212529]/10 bg-white p-3 shadow-sm"
                >
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded-md" />
                        <Skeleton className="h-4 w-30" />
                    </div>
                    <Skeleton className="h-5 w-10 rounded-md" />
                </li>
            ))}
        </ul>
    );
}


export function SkeletonGrid({
    count = 6,
    className = "",
}: {
    count?: number;
    className?: string;
}) {
    return (
        <div
            className={[
                "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                className,
            ].join(" ")}
        >
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-xl border border-[#212529]/10 bg-white p-4 shadow-sm"
                >
                    <Skeleton className="h-4 w-3/5" />
                    <Skeleton className="mt-2 h-4 w-4/5" />
                    <div className="mt-4 flex justify-end gap-2">
                        <Skeleton className="h-6 w-8 rounded-md" />
                        <Skeleton className="h-6 w-8 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    );
}

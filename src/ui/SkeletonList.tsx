import Skeleton from "./Skeleton";

export default function SkeletonList({ rows = 6 }: { rows?: number }) {
    return (
        <ul className="space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <li key={i} className="p-2 border rounded">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-40" />
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-6 w-12" />
                            <Skeleton className="h-6 w-12" />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

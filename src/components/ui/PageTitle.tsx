import type { ReactNode } from "react";

export default function PageTitle({
    title,
    subtitle,
    icon,
    right,
}: {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    right?: ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                {icon && (
                    <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#4F46E5]/10 text-[#4F46E5]">
                        {icon}
                    </span>
                )}
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold">{title}</h1>
                    {subtitle && <p className="text-sm text-[#212529]/70">{subtitle}</p>}
                </div>
            </div>
            {right}
        </div>
    );
}

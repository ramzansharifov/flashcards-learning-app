import { useEffect } from "react";
import type { ReactNode } from "react";

type Props = {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
};

export default function Modal({ open, title, onClose, children, footer }: Props) {
    useEffect(() => {
        const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        if (open) document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-md rounded bg-white p-4 shadow-lg">
                {title && <h3 className="mb-3 text-lg font-semibold">{title}</h3>}
                <div>{children}</div>
                {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
            </div>
        </div>
    );
}

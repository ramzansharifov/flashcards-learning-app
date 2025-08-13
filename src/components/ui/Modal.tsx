import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type Props = {
    open: boolean;
    title?: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
    /** Закрывать по клику на фон */
    closeOnBackdrop?: boolean;
    /** Размер контейнера */
    size?: "sm" | "md" | "lg";
    /** Не показывать кнопку закрытия (крестик) */
    hideCloseButton?: boolean;
};

export default function Modal({
    open,
    title,
    onClose,
    children,
    footer,
    closeOnBackdrop = true,
    size = "md",
    hideCloseButton = false,
}: Props) {
    const [mounted, setMounted] = useState(open);
    const [show, setShow] = useState(open); // для анимации
    const dialogRef = useRef<HTMLDivElement | null>(null);

    // Монтирование/анимация
    useEffect(() => {
        if (open) {
            setMounted(true);
            // нужно дать кадр, чтобы применились transition классы
            requestAnimationFrame(() => setShow(true));
        } else {
            setShow(false);
            // дождаться завершения анимации и размонтировать
            const t = setTimeout(() => setMounted(false), 160);
            return () => clearTimeout(t);
        }
    }, [open]);

    // Esc + trap focus + блокировка скролла подложки
    useEffect(() => {
        if (!mounted) return;

        // lock scroll
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "Tab") {
                // trap focus
                const root = dialogRef.current;
                if (!root) return;
                const focusables = root.querySelectorAll<HTMLElement>(
                    'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
                );
                if (!focusables.length) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                const active = document.activeElement as HTMLElement | null;
                if (e.shiftKey) {
                    if (active === first || !root.contains(active)) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (active === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        };

        document.addEventListener("keydown", onKey);

        // автофокус внутрь
        const toFocus =
            dialogRef.current?.querySelector<HTMLElement>(
                'input,button,textarea,select,[tabindex]:not([tabindex="-1"])'
            ) ?? dialogRef.current;
        toFocus?.focus();

        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", onKey);
        };
    }, [mounted, onClose]);

    if (!mounted) return null;

    const sizeClass =
        size === "sm"
            ? "max-w-sm"
            : size === "lg"
                ? "max-w-2xl"
                : "max-w-md";

    // анимационные классы
    const overlayClass = show
        ? "opacity-100"
        : "opacity-0";
    const panelClass = show
        ? "translate-y-0 scale-100 opacity-100"
        : "translate-y-2 scale-[0.98] opacity-0";

    const modal = (
        <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
        >
            {/* Подложка */}
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity duration-150 ${overlayClass}`}
                onClick={closeOnBackdrop ? onClose : undefined}
            />

            {/* Панель */}
            <div className="relative flex min-h-full items-center justify-center p-4 pointer-events-none">
                <div
                    ref={dialogRef}
                    tabIndex={-1}
                    className={[
                        "pointer-events-auto relative w-full rounded-xl border border-[#212529]/10 bg-white shadow-lg",
                        "transition-all duration-150",
                        "outline-none",
                        sizeClass,
                        panelClass,
                    ].join(" ")}
                >
                    {/* Заголовок + крестик */}
                    {(title || !hideCloseButton) && (
                        <div className="flex items-start justify-between gap-6 p-4 sm:p-5">
                            {title ? (
                                <h3 id="modal-title" className="text-lg font-semibold text-[#111827]">
                                    {title}
                                </h3>
                            ) : <span className="sr-only">Modal</span>}

                            {!hideCloseButton && (
                                <button
                                    type="button"
                                    aria-label="Close"
                                    className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#212529]/15 bg-white text-[#111827]/70 hover:bg-white/80"
                                    onClick={onClose}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Контент */}
                    <div className="px-4 pb-4 sm:px-5">
                        {children}
                    </div>

                    {/* Футер */}
                    {footer && (
                        <div className="flex items-center justify-end gap-2 border-t border-[#212529]/10 px-4 py-3 sm:px-5">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Портал в body
    return createPortal(modal, document.body);
}

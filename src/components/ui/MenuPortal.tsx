import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function MenuPortal({
    anchorEl,
    children,
    onClose,
    scrollContainer,
}: {
    anchorEl: HTMLElement;
    children: React.ReactNode;
    onClose: () => void;
    /** скроллящийся контейнер (ul) — чтобы слушать его scroll */
    scrollContainer: HTMLElement | null;
}) {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    const portalRoot = useMemo(() => document.body, []);

    // Клик вне — закрыть
    useEffect(() => {
        function onDocMouseDown(e: MouseEvent) {
            const m = menuRef.current;
            if (!m) return;
            const target = e.target as Node;
            if (m.contains(target) || anchorEl.contains(target)) return;
            onClose();
        }
        document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [onClose, anchorEl]);

    // Вычисление позиции
    const compute = () => {
        const btnRect = anchorEl.getBoundingClientRect();
        const menuEl = menuRef.current;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Предполагаем размеры меню; если меню уже в DOM — используем реальные
        const menuW = menuEl?.offsetWidth ?? 180;
        const menuH = menuEl?.offsetHeight ?? 140;

        // default: под кнопкой
        let top = btnRect.bottom + 8;
        let left = btnRect.left;

        // если не влезает снизу — открываем вверх
        if (top + menuH > vh) {
            top = Math.max(8, btnRect.top - menuH - 8);
        }

        // если вылезает вправо — прижимаем к правому краю кнопки/вьюпорта
        if (left + menuW > vw - 8) {
            left = Math.max(8, btnRect.right - menuW);
        }

        // прижать минимум к левому краю
        left = Math.max(8, left);

        setPos({ top, left });
    };

    // Рекомпоновка при открытии/ресайзе/скролле (окно + список)
    useEffect(() => {
        compute();
        const onResize = () => compute();
        const onScroll = () => compute();

        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, { passive: true });

        // Внутренний скролл списка (ul)
        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", onScroll, { passive: true });
        }

        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll);
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", onScroll);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [anchorEl, scrollContainer]);

    const node = (
        <div
            ref={menuRef}
            role="menu"
            // fixed + координаты во вьюпорте → меню вообще не участвует в потоке
            style={{ position: "fixed", top: pos.top, left: pos.left }}
            className="z-50 w-24 rounded-xl border border-[#212529]/12 bg-white p-2 shadow-lg cursor-auto"
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );

    return createPortal(node, portalRoot);
}

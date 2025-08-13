import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
    frontText: string;
    backText: string;
    flipped: boolean;
    onToggleFlip: () => void;
    disabled?: boolean;
    className?: string; // размеры карточки
};

export default function StudyFlipCard({
    frontText,
    backText,
    flipped,
    onToggleFlip,
    disabled,
    className = "relative h-44 w-80 sm:w-96 max-w-full cursor-pointer",
}: Props) {
    return (
        <button
            type="button"
            className={`${className} transition-transform duration-150 active:scale-75`}
            onClick={onToggleFlip}
            style={{ perspective: 1000 }}
            disabled={disabled}
        >
            <motion.div
                className="relative h-full w-full"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* FRONT */}
                <CardSide bg="primary">
                    <SmartText text={frontText} color="light" />
                </CardSide>

                {/* BACK */}
                <CardSide bg="white" rotated>
                    <SmartText text={backText} color="primary" scrollHint />
                </CardSide>
            </motion.div>
        </button>
    );
}

/* ---------- Внутренние элементы ---------- */

function CardSide({
    children,
    bg,
    rotated = false,
}: {
    children: React.ReactNode;
    bg: "primary" | "white";
    rotated?: boolean;
}) {
    const base =
        "absolute inset-0 rounded-xl px-4 py-3 shadow-md flex h-full w-full overflow-hidden";
    const skin =
        bg === "primary"
            ? "bg-[#4F46E5] text-white"
            : "border border-[#4F46E5] bg-white text-[#4F46E5]";
    return (
        <div
            className={`${base} ${skin}`}
            style={{
                backfaceVisibility: "hidden",
                transform: rotated ? "rotateY(180deg)" : undefined,
            }}
        >
            {children}
        </div>
    );
}

function SmartText({
    text,
    color,
    scrollHint = false,
}: {
    text: string;
    color: "light" | "primary";
    scrollHint?: boolean;
}) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [overflow, setOverflow] = useState(false);
    const [isLong, setIsLong] = useState(false);

    // эвристика длины
    useEffect(() => {
        const lines = text.split(/\r?\n/).length;
        const chars = text.length;
        setIsLong(chars > 160 || lines > 2);
    }, [text]);

    // реальная проверка переполнения
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const check = () => setOverflow(el.scrollHeight > el.clientHeight + 1);
        check();

        const ro = new ResizeObserver(check);
        ro.observe(el);
        const onResize = () => check();
        window.addEventListener("resize", onResize);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", onResize);
        };
    }, [text]);

    // отслеживаем «тащил/скроллил» vs «тап/клик»
    const start = useRef<{ x: number; y: number; scrollTop: number }>({ x: 0, y: 0, scrollTop: 0 });
    const dragged = useRef(false);

    const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
        const el = wrapRef.current;
        dragged.current = false;
        start.current = {
            x: e.clientX,
            y: e.clientY,
            scrollTop: el ? el.scrollTop : 0,
        };
    };

    const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
        // небольшой порог, чтобы отличать «тап» от «перетаскивания/скролла»
        const dx = Math.abs(e.clientX - start.current.x);
        const dy = Math.abs(e.clientY - start.current.y);
        if (dx + dy > 6) dragged.current = true;
    };

    const onClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if (!overflow) return; // короткий текст — всегда переворачиваем
        const el = wrapRef.current;
        const scrolled = el ? el.scrollTop !== start.current.scrollTop : false;
        // если тащили или реально прокрутили — глушим клик (не переворачиваем)
        if (dragged.current || scrolled) e.stopPropagation();
    };

    const longMode = isLong || overflow;

    const containerClasses = [
        "flex h-full w-full min-h-0",
        longMode ? "items-start justify-start text-left" : "items-center justify-center text-center",
    ].join(" ");

    const textClasses = [
        "w-full max-h-full",
        longMode ? "text-base leading-relaxed" : "text-lg leading-snug",
        overflow ? "overflow-y-auto pr-2 [-webkit-overflow-scrolling:touch]" : "overflow-hidden",
        "break-words whitespace-pre-wrap",
    ].join(" ");

    return (
        <div className={containerClasses}>
            <div
                ref={wrapRef}
                className={textClasses}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onClick={onClick}
            >
                {scrollHint && overflow && (
                    <div className={`mt-2 text-[11px] ${color === "light" ? "text-white/80" : "text-[#4F46E5]/70"}`}>
                        Scroll for more…
                    </div>
                )}
                {text}
            </div>
        </div>
    );
}
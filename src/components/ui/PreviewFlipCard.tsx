import { useCallback, useEffect, useState } from "react";
import StudyFlipCard from "./StudyFlipCard";

type Props = { front: string; back: string; className?: string };

export default function PreviewFlipCard({ front, back }: Props) {
    const [flipped, setFlipped] = useState(false);
    const onToggleFlip = useCallback(() => setFlipped(v => !v), []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                onToggleFlip();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onToggleFlip]);

    return (
        <div className="flex items-center justify-center w-auto">
            <StudyFlipCard
                frontText={front}
                backText={back}
                flipped={flipped}
                onToggleFlip={onToggleFlip}
            />
        </div>
    );
}

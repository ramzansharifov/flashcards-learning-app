import { useState } from "react";

type Props = {
    initialFront?: string;
    initialBack?: string;
    onSubmit: (front: string, back: string) => void | Promise<void>;
    submitLabel?: string;
};
export default function CardForm({
    initialFront = "",
    initialBack = "",
    onSubmit,
    submitLabel = "Save",
}: Props) {
    const [front, setFront] = useState(initialFront);
    const [back, setBack] = useState(initialBack);

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(front.trim(), back.trim()); }} className="space-y-3">
            <input
                autoFocus
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Front"
                className="input input-bordered w-full"
            />
            <input
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Back"
                className="input input-bordered w-full"
            />
            <button className="btn btn-primary w-full" type="submit">{submitLabel}</button>
        </form>
    );
}

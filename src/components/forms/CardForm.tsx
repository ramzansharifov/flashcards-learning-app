import { useEffect, useState } from "react";

type Props = {
    initialFront?: string;
    initialBack?: string;
    onSubmit: (front: string, back: string) => void | Promise<void>;
    submitLabel?: string;
};

export default function CardForm({ initialFront = "", initialBack = "", onSubmit, submitLabel = "Save" }: Props) {
    const [front, setFront] = useState(initialFront);
    const [back, setBack] = useState(initialBack);
    const [touched, setTouched] = useState({ front: false, back: false });
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { setFront(initialFront); setBack(initialBack); }, [initialFront, initialBack]);

    const valid = front.trim().length >= 1 && back.trim().length >= 1;
    const showFrontErr = (touched.front || submitAttempted) && front.trim().length < 1;
    const showBackErr = (touched.back || submitAttempted) && back.trim().length < 1;

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                setSubmitAttempted(true);
                if (!valid) return;
                setSubmitting(true);
                await onSubmit(front.trim(), back.trim());
                setSubmitting(false);
            }}
            className="space-y-3"
        >
            <input
                autoFocus
                value={front}
                onChange={(e) => setFront(e.target.value)}
                onBlur={() => setTouched(s => ({ ...s, front: true }))}
                placeholder="Front"
                className={`input input-bordered w-full ${showFrontErr ? "input-error" : ""}`}
                aria-invalid={showFrontErr}
            />
            {showFrontErr && <p className="text-sm text-red-600">Front is required</p>}

            <input
                value={back}
                onChange={(e) => setBack(e.target.value)}
                onBlur={() => setTouched(s => ({ ...s, back: true }))}
                placeholder="Back"
                className={`input input-bordered w-full ${showBackErr ? "input-error" : ""}`}
                aria-invalid={showBackErr}
            />
            {showBackErr && <p className="text-sm text-red-600">Back is required</p>}

            <button className="btn btn-primary w-full" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}

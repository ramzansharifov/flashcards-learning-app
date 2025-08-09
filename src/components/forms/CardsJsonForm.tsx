import { useMemo, useState } from "react";

type Item = { front: string; back: string };
type Props = { onSubmit: (items: Item[]) => void | Promise<void>; };

const EXAMPLE = `[
  { "front": "What is OOP?", "back": "Objects, encapsulation, inheritance, polymorphism" },
  { "front": "TypeScript", "back": "Typed superset of JavaScript" }
]`;

export default function CardsJsonForm({ onSubmit }: Props) {
    const [text, setText] = useState("");
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const { items, error } = useMemo(() => {
        if (!text.trim()) return { items: [] as Item[], error: null as string | null };
        try {
            const data = JSON.parse(text);
            if (!Array.isArray(data)) return { items: [] as Item[], error: "JSON must be an array" };

            const parsed: Item[] = [];
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                if (typeof row !== "object" || row === null || Array.isArray(row)) {
                    return { items: [] as Item[], error: `Item at index ${i} must be an object` };
                }
                const keys = Object.keys(row);
                const allowed = new Set(["front", "back"]);
                // любой лишний ключ — ошибка
                const hasExtra = keys.some(k => !allowed.has(k));
                if (hasExtra) return { items: [] as Item[], error: `Item at index ${i} has extra keys. Allowed: front, back` };

                const f = typeof row.front === "string" ? row.front.trim() : "";
                const b = typeof row.back === "string" ? row.back.trim() : "";
                if (!f || !b) return { items: [] as Item[], error: `Item at index ${i} must have non-empty 'front' and 'back'` };

                parsed.push({ front: f, back: b });
            }
            return { items: parsed, error: null as string | null };
        } catch (e: any) {
            return { items: [] as Item[], error: e.message ?? "Invalid JSON" };
        }
    }, [text]);

    const showError = submitAttempted && (!!error || items.length === 0);
    const errorText =
        error ?? (items.length === 0 ? "Paste a non-empty array of cards" : "");

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                setSubmitAttempted(true);
                if (error || items.length === 0) return;
                await onSubmit(items);
            }}
            className="space-y-3"
        >
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={EXAMPLE}
                className={`textarea textarea-bordered w-full min-h-[220px] ${showError ? "textarea-error" : ""}`}
                aria-invalid={showError}
            />
            {showError && <p className="text-sm text-red-600">{errorText}</p>}
            {items.length > 0 && !error && (
                <p className="text-sm text-gray-600">Ready to import: <b>{items.length}</b> cards</p>
            )}
            <button className="btn btn-primary w-full" type="submit">Import</button>
        </form>
    );
}

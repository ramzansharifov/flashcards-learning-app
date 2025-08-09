import { useMemo, useState } from "react";

type Raw = { front?: unknown; back?: unknown };
type Item = { front: string; back: string };

type Props = {
    onSubmit: (items: Item[]) => void | Promise<void>;
};

const EXAMPLE = `[
  { "front": "What is OOP?", "back": "Paradigm with objects, encapsulation, inheritance, polymorphism" },
  { "front": "TypeScript", "back": "Typed superset of JavaScript" }
]`;

export default function CardsJsonForm({ onSubmit }: Props) {
    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);

    const parsed = useMemo(() => {
        if (!text.trim()) return { items: [] as Item[], error: null as string | null };
        try {
            const data = JSON.parse(text) as Raw[] | unknown;
            if (!Array.isArray(data)) return { items: [] as Item[], error: "JSON must be an array" };
            const items: Item[] = [];
            for (const [idx, r] of (data as Raw[]).entries()) {
                const f = typeof r.front === "string" ? r.front.trim() : "";
                const b = typeof r.back === "string" ? r.back.trim() : "";
                if (!f || !b) return { items: [] as Item[], error: `Invalid item at index ${idx}: needs 'front' and 'back' strings` };
                items.push({ front: f, back: b });
            }
            return { items, error: null as string | null };
        } catch (e: any) {
            return { items: [] as Item[], error: e.message ?? "Invalid JSON" };
        }
    }, [text]);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                if (parsed.error) { setError(parsed.error); return; }
                if (!parsed.items.length) { setError("No items to import"); return; }
                setError(null);
                await onSubmit(parsed.items);
            }}
            className="space-y-3"
        >
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={EXAMPLE}
                className="textarea textarea-bordered w-full min-h-[200px]"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {parsed.items.length > 0 && !parsed.error && (
                <p className="text-sm text-gray-600">Ready to import: <b>{parsed.items.length}</b> cards</p>
            )}
            <button className="btn btn-primary w-full" type="submit">Import</button>
        </form>
    );
}

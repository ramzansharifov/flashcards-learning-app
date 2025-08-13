import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Item = { front: string; back: string };
type Props = { onSubmit: (items: Item[]) => void | Promise<void> };

const EXAMPLE = `[
  { "front": "What is OOP?", "back": "Objects, encapsulation, inheritance, polymorphism" },
  { "front": "TypeScript", "back": "Typed superset of JavaScript" }
]`;

// ── Zod-схема: парсим raw JSON → items ─────────────────────────────────────────
const itemsSchema = z
    .array(
        z
            .object({
                front: z.string().trim().min(1, "front is empty"),
                back: z.string().trim().min(1, "back is empty"),
            })
            .passthrough() // чтобы поймать лишние ключи вручную
            .superRefine((val, ctx) => {
                const allowed = new Set(["front", "back"]);
                const extras = Object.keys(val).filter((k) => !allowed.has(k));
                if (extras.length > 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: `extra keys: ${extras.join(", ")}`,
                    });
                }
            })
    )
    .min(1, "JSON array must contain at least 1 item");

const schema = z.object({
    raw: z
        .string()
        .transform((s) => s.trim())
        .superRefine((raw, ctx) => {
            if (!raw) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Paste a non-empty JSON array" });
                return;
            }
            let data: unknown;
            try {
                data = JSON.parse(raw);
            } catch (e: any) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: e?.message || "Invalid JSON" });
                return;
            }
            const parsed = itemsSchema.safeParse(data);
            if (!parsed.success) {
                // Сшиваем первую важную ошибку, чтобы не заспамить UI
                const first = parsed.error.issues[0];
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        first?.message ||
                        "JSON must be an array of objects with non-empty 'front' and 'back'",
                });
                return;
            }
            // кладём готовые items во внешнее "сохранённое" место — через ctx
            (ctx as any).parsedItems = parsed.data as Item[];
        }),
});

type Values = z.input<typeof schema>;

// ── Локальный textarea с теми же стилями, что и InputField ──────────────────────
function TextareaField({
    id,
    label,
    error,
    className = "",
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-[#212529]">
                {label}
            </label>
            <textarea
                id={id}
                className={[
                    "w-full min-h-[220px] rounded-xl border bg-white px-4 py-3 text-sm outline-none transition max-h-[50vh]",
                    "border-[#212529]/15 focus:ring-2 focus:ring-[#4F46E5]",
                    error ? "border-red-500 focus:ring-red-500" : "",
                    className,
                ].join(" ")}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-err` : undefined}
                {...props}
            />
            {error && (
                <p id={`${id}-err`} className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function CardsJsonForm({ onSubmit }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
        trigger,
    } = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { raw: "" },
        mode: "onBlur",
    });

    const raw = watch("raw");

    // получаем «готовность»/предпросмотр кол-ва
    const readyCount = useMemo(() => {
        if (!raw?.trim()) return 0;
        try {
            const data = JSON.parse(raw);
            const ok = itemsSchema.safeParse(data);
            return ok.success ? ok.data.length : 0;
        } catch {
            return 0;
        }
    }, [raw]);

    const submit = async (values: Values, e?: React.BaseSyntheticEvent) => {
        // Достаём items, которые мы положили в superRefine через ctx.parsedItems
        // react-hook-form резолвер не отдаёт напрямую ctx, поэтому парсим ещё раз безопасно.
        const data = JSON.parse(values.raw);
        const parsed = itemsSchema.parse(data);
        await onSubmit(parsed);
    };

    // helpers
    const pasteExample = () => {
        setValue("raw", EXAMPLE, { shouldDirty: true });
        void trigger("raw");
    };

    const formatJson = () => {
        try {
            const obj = JSON.parse(raw || "[]");
            setValue("raw", JSON.stringify(obj, null, 2), { shouldDirty: true });
        } catch {
            // игнор: если невалидный JSON — ничего не делаем
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
            <TextareaField
                id="cards-json"
                label="Cards JSON"
                placeholder={EXAMPLE}
                {...register("raw")}
                error={errors.raw?.message}
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-[#212529]/70">
                    {readyCount > 0 ? (
                        <>
                            Ready to import: <b>{readyCount}</b> cards
                        </>
                    ) : (
                        <>Paste a JSON array of objects with <code>front</code> and <code>back</code>.</>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={pasteExample}
                        className="rounded-lg cursor-pointer border border-[#212529]/15 bg-white px-3 py-2 text-sm hover:bg-white/80"
                    >
                        Paste example
                    </button>
                    <button
                        type="button"
                        onClick={formatJson}
                        className="rounded-lg cursor-pointer border border-[#212529]/15 bg-white px-3 py-2 text-sm hover:bg-white/80"
                    >
                        Format JSON
                    </button>
                </div>
            </div>

            <button
                className="inline-flex cursor-pointer w-full items-center justify-center rounded-xl bg-[#4F46E5] px-5 py-3 text-base font-semibold text-white shadow-sm hover:opacity-95 active:opacity-90 disabled:opacity-60"
                type="submit"
                disabled={isSubmitting || readyCount === 0}
                aria-busy={isSubmitting}
            >
                {isSubmitting ? "Importing..." : "Import"}
            </button>
        </form>
    );
}

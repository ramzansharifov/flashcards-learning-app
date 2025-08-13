import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "../ui/InputField";

type Props = {
    initialFront?: string;
    initialBack?: string;
    onSubmit: (front: string, back: string) => void | Promise<void>;
    submitLabel?: string;
};

const schema = z.object({
    front: z.string().trim().min(1, "Front is required"),
    back: z.string().trim().min(1, "Back is required"),
});
type Values = z.infer<typeof schema>;

export default function CardForm({
    initialFront = "",
    initialBack = "",
    onSubmit,
    submitLabel = "Save",
}: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { front: initialFront, back: initialBack },
        mode: "onBlur",
    });

    useEffect(() => {
        reset({ front: initialFront, back: initialBack });
    }, [initialFront, initialBack, reset]);

    const submit = async (data: Values) => {
        await onSubmit(data.front.trim(), data.back.trim());
    };

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="space-y-3"
            onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    void handleSubmit(submit)();
                }
            }}
        >
            <InputField
                id="card-front"
                label="Front"
                placeholder="Question / term"
                {...register("front")}
                error={errors.front?.message}
            />
            <InputField
                id="card-back"
                label="Back"
                placeholder="Answer / definition"
                {...register("back")}
                error={errors.back?.message}
            />
            <button
                className="inline-flex cursor-pointer w-full items-center justify-center rounded-xl bg-[#4F46E5] px-5 py-3 text-base font-semibold text-white shadow-sm hover:opacity-95 active:opacity-90 disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
            >
                {isSubmitting ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}

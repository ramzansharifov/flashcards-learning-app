import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "../ui/InputField";

type Props = {
    initialName?: string;
    onSubmit: (name: string) => void | Promise<void>;
    submitLabel?: string;
};

const schema = z.object({
    name: z.string().trim().min(1, "Name is required"),
});
type Values = z.infer<typeof schema>;

export default function TopicForm({
    initialName = "",
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
        defaultValues: { name: initialName },
        mode: "onBlur",
    });

    useEffect(() => {
        reset({ name: initialName });
    }, [initialName, reset]);

    const submit = async (data: Values) => {
        await onSubmit(data.name.trim());
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
            <InputField
                id="topic-name"
                label="Topic name"
                placeholder="Enter name"
                {...register("name")}
                error={errors.name?.message}
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

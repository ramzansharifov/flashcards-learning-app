import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// ⚠️ используй тот же компонент, что в Auth. Если он локальный — вынеси.
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

export default function WorkspaceForm({
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

    // синхронизация с пропами
    useEffect(() => {
        reset({ name: initialName });
    }, [initialName, reset]);

    const submit = async (data: Values) => {
        await onSubmit(data.name.trim());
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
            <InputField
                id="ws-name"
                label="Workspace name"
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

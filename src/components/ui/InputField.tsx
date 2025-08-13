import { forwardRef } from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export const InputField = forwardRef<HTMLInputElement, InputProps>(
    ({ id, label, error, className = "", ...props }, ref) => (
        <div>
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-[#212529]">
                {label}
            </label>

            <input
                id={id}
                ref={ref}
                className={[
                    "w-full rounded-xl border bg-white px-4 py-3 outline-none transition",
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
    )
);

InputField.displayName = "InputField";

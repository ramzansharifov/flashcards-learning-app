import { useEffect, useState } from "react";

type Props = {
    initialName?: string;
    onSubmit: (name: string) => void | Promise<void>;
    submitLabel?: string;
};

export default function WorkspaceForm({ initialName = "", onSubmit, submitLabel = "Save" }: Props) {
    const [name, setName] = useState(initialName);
    const [touched, setTouched] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { setName(initialName); }, [initialName]);

    const valid = name.trim().length >= 1;
    const showError = (touched || submitAttempted) && !valid;
    const errorText = showError ? "Name is required" : "";

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                setSubmitAttempted(true);
                if (!valid) return;
                setSubmitting(true);
                await onSubmit(name.trim());
                setSubmitting(false);
            }}
            className="space-y-3"
        >
            <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Workspace name"
                className={`input input-bordered w-full ${showError ? "input-error" : ""}`}
                aria-invalid={showError}
            />
            {showError && <p className="text-sm text-red-600">{errorText}</p>}
            <button className="btn btn-primary w-full" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}

import { useState } from "react";

type Props = {
    initialName?: string;
    onSubmit: (name: string) => void | Promise<void>;
    submitLabel?: string;
};
export default function WorkspaceForm({ initialName = "", onSubmit, submitLabel = "Save" }: Props) {
    const [name, setName] = useState(initialName);
    return (
        <form
            onSubmit={(e) => { e.preventDefault(); onSubmit(name.trim()); }}
            className="space-y-3"
        >
            <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Workspace name"
                className="input input-bordered w-full"
            />
            <button className="btn btn-primary w-full" type="submit">{submitLabel}</button>
        </form>
    );
}

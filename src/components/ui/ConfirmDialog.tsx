import { useState } from "react";
import Modal from "./Modal";

type Props = {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
};

export default function ConfirmDialog({
    open,
    title = "Confirm",
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}: Props) {
    const [submitting, setSubmitting] = useState(false);

    const handleConfirm = async () => {
        if (submitting) return;
        try {
            setSubmitting(true);
            await onConfirm();
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            title={title}
            onClose={onCancel}
            size="sm"
            footer={
                <>
                    <button
                        type="button"
                        className="rounded-lg cursor-pointer border border-[#212529]/15 bg-white px-4 py-2 text-sm hover:bg-white/80 disabled:opacity-60"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95 active:opacity-90 disabled:opacity-60"
                        onClick={handleConfirm}
                        disabled={submitting}
                        aria-busy={submitting}
                    >
                        {submitting && (
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
                                <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="3" />
                            </svg>
                        )}
                        {confirmText}
                    </button>
                </>
            }
        >
            <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 8v5m0 3h.01M12 2a10 10 0 1 0 0 20a10 10 0 0 0 0-20Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </span>
                <p className="text-sm text-[#111827]">{message}</p>
            </div>
        </Modal>
    );
}

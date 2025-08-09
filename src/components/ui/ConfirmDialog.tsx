import Modal from "./Modal";

type Props = {
    open: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
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
    return (
        <Modal
            open={open}
            title={title}
            onClose={onCancel}
            footer={
                <>
                    <button className="btn" onClick={onCancel}>{cancelText}</button>
                    <button className="btn btn-error" onClick={onConfirm}>{confirmText}</button>
                </>
            }
        >
            <p>{message}</p>
        </Modal>
    );
}

import { X, Trash2, AlertTriangle } from "lucide-react";


function ConfirmationDialog({
    open,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to continue?",
    type
}) {

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            {/* Modal Box */}
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-5 py-3">

                    <div className="flex items-center gap-2">
                        {type === "danger" ? (
                            <AlertTriangle className="text-red-500" size={20} />
                        ) : (
                            <AlertTriangle className="text-green-500" size={20} />
                        )}

                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-md p-1 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-5 py-5 text-left text-gray-600">
                    <b>{message}</b>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-5 py-3">

                    <button
                        onClick={onClose}
                        className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white
              ${type === "danger"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {type === "danger" && <Trash2 size={16} />}
                        Confirm
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ConfirmationDialog;
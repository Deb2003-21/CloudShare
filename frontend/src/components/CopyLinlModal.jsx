import { useState } from "react";

function CopyLinkModal({ open, onClose, link }) {
    const [copied, setCopied] = useState(false);

    if (!open) return null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true);

        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {/* Modal Box */}
            <div className="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-lg">

                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Share
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Link Input */}
                <div className="mb-4">


                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">

                        <input
                            type="text"
                            readOnly
                            value={link}
                            className="w-full bg-transparent text-sm text-gray-700 outline-none"
                        />

                        <button
                            onClick={handleCopy}
                            className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                        >
                            Copy
                        </button>

                    </div>
                </div>

                {/* Copied Message */}
                {copied && (
                    <p className="text-sm text-green-600">
                        Link copied to clipboard!
                    </p>
                )}

            </div>
        </div>
    );
}

export default CopyLinkModal;
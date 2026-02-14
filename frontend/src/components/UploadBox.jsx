import { UploadCloud, File, Folder, Trash2 } from "lucide-react";

export default function UploadBox({
    files,
    onFileChange,
    onUpload,
    uploading,
    onRemoveFile,
    remainingCredits,
    isUploadDisabled,
}) {
    return (
        <div className="w-full max-w-3xl mx-auto border-2 border-dashed border-blue-300 rounded-lg p-8 bg-white">

            {/* Header */}
            <div className="text-center mb-6">
                <UploadCloud size={48} className="mx-auto text-blue-600 mb-2" />

                <h2 className="text-lg font-semibold text-gray-700">
                    Get started by adding your first file
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Upload files or folders
                </p>
            </div>

            {/* Upload Buttons */}
            <div className="flex justify-center gap-4 mb-6">

                {/* File Upload */}
                <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                    <File size={18} />
                    Upload File
                    <input
                        type="file"
                        hidden
                        multiple
                        onChange={onFileChange}
                        disabled={isUploadDisabled}
                    />
                </label>


            </div>

            {/* Selected Files */}
            {files.length > 0 && (
                <div className="border rounded-md p-4 mb-4 max-h-48 overflow-y-auto">

                    <h3 className="text-sm font-semibold mb-2 text-gray-700">
                        Selected Files
                    </h3>

                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li
                                key={index}
                                className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded"
                            >
                                <span className="text-sm text-gray-700 truncate max-w-xs">
                                    {file.name}
                                </span>

                                <button
                                    onClick={() => onRemoveFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>

                </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center">

                {/* Credits */}
                <p className="text-sm text-gray-600">
                    Remaining Credits:{" "}
                    <span className="font-semibold">{remainingCredits}</span>
                </p>

                {/* Upload Button */}
                <button
                    onClick={onUpload}
                    disabled={uploading || isUploadDisabled || files.length === 0}
                    className={`px-6 py-2 rounded text-white font-medium
            ${uploading || isUploadDisabled || files.length === 0
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }
          `}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>

            </div>
        </div>
    );
}
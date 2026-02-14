import React from 'react'
import ConfirmationDialog from './ConfirmationDialog'
import { Copy, DownloadIcon, Eye, File, Globe, Lock, Trash2 } from 'lucide-react'
import CopyLinkModal from './CopyLinlModal'

function ListCard({ files, togglePublic, setOpen1, setOpen, handleClick, handleDelete, downloadFile, open, type, open1, deleteFile, getFileIcon }) {
    return (
        <>

            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow border">

                <table className="min-w-full">

                    <thead className="bg-gray-100 border-b">
                        <tr>

                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                File
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Size
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Uploaded
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                                Status
                            </th>

                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                                Actions
                            </th>

                        </tr>
                    </thead>


                    <tbody className="divide-y">

                        {files.map((file) => (
                            <tr key={file.id} className="hover:bg-gray-50">

                                {/* Name */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">

                                        {getFileIcon(file)}

                                        <span className="font-medium truncate max-w-[220px]">
                                            {file.name}
                                        </span>

                                    </div>
                                </td>

                                {/* Size */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {(file.size / 1024).toFixed(1)} KB
                                </td>

                                {/* Date */}
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(file.uploadAt).toLocaleDateString()}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => togglePublic(file)}
                                            className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full font-medium cursor-pointer
                                                                 ${file.isPublic ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}

                                        >

                                            {file.isPublic ? <Globe size={14} /> : <Lock size={14} />}

                                            {file.isPublic ? "Public" : "Private"}

                                        </button>
                                        <button title="copy link" className="cursor-pointer"
                                            onClick={() => setOpen1(true)}
                                        >

                                            {file.isPublic && <Copy size={18} />}

                                        </button>
                                        <CopyLinkModal
                                            open={open1}
                                            onClose={() => setOpen1(false)}
                                            link={`${window.location.origin}/file/${file.id}`}
                                        />

                                    </div>
                                </td>


                                {/* Actions */}
                                <td className="px-6 py-4 text-right">

                                    <div className="flex justify-end gap-3">
                                        <>
                                            <button
                                                onClick={() => handleClick(file)}
                                                title="Download"
                                                className="text-gray-500 hover:text-blue-600"
                                            >
                                                <DownloadIcon size={18} />
                                            </button>

                                            <ConfirmationDialog
                                                open={open}
                                                onClose={() => setOpen(false)}
                                                onConfirm={() => downloadFile(file)}
                                                message={type.selectedFile}
                                                title={type.title}
                                                type={type.type}


                                            />
                                        </>
                                        <>
                                            <button
                                                onClick={() => handleDelete(file)}
                                                title="Delete"
                                                className="text-gray-500 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <ConfirmationDialog
                                                open={open}
                                                onClose={() => setOpen(false)}
                                                onConfirm={() => deleteFile(file)}
                                                message={type.selectedFile}
                                                title={type.title}
                                                type={type.type}


                                            /></>


                                        {file.isPublic && (
                                            <a
                                                href={`/file/${file.id}`}
                                                title="View File"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-gray-700 hover:text-gray-900"
                                            >
                                                <Eye size={18} />
                                            </a>
                                        )}

                                    </div>

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>


            {/* ================= MOBILE CARDS ================= */}
            <div className="md:hidden space-y-4">
                {
                    files.map((file) => (
                        <div
                            key={file.id}
                            className="bg-white rounded-xl border shadow p-4"
                        >

                            {/* Top */}
                            <div className="flex items-start justify-between mb-3">

                                <div className="flex items-center gap-2">

                                    {getFileIcon(file)}

                                    <p className="font-medium truncate max-w-[200px]">
                                        {file.name}
                                    </p>

                                </div>


                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => togglePublic(file)}
                                        className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full font-medium cursor-pointer
                                                                 ${file.isPublic ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}

                                    >

                                        {file.isPublic ? <Globe size={14} /> : <Lock size={14} />}

                                        {file.isPublic ? "Public" : "Private"}

                                    </button>
                                    <button title="copy link" className="cursor-pointer"
                                        onClick={() => setOpen1(true)}
                                    >

                                        {file.isPublic && <Copy size={18} />}

                                    </button>
                                    <CopyLinkModal
                                        open={open1}
                                        onClose={() => setOpen1(false)}
                                        link={`${window.location.origin}/file/${file.id}`}
                                    />
                                </div>

                            </div>


                            {/* Info */}
                            <div className="text-sm text-gray-500 space-y-1 mb-3">

                                <p>
                                    Size: {(file.size / 1024).toFixed(1)} KB
                                </p>

                                <p>
                                    Uploaded: {new Date(file.uploadAt).toLocaleDateString()}
                                </p>

                            </div>


                            {/* Actions */}
                            <div className="flex justify-end gap-4 border-t pt-3">

                                <>
                                    <button
                                        onClick={() => handleClick()}
                                        title="Download"
                                        className="text-gray-500 hover:text-blue-600"
                                    >
                                        <DownloadIcon size={18} />
                                    </button>

                                    <ConfirmationDialog
                                        open={open}
                                        onClose={() => setOpen(false)}
                                        onConfirm={() => downloadFile(file)}
                                        message={type.selectedFile}
                                        title={type.title}
                                        type={type.type}



                                    />
                                </>

                                <>
                                    <button
                                        onClick={() => handleDelete(file)}
                                        title="Delete"
                                        className="text-gray-500 hover:text-red-600"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <ConfirmationDialog
                                        open={open}
                                        onClose={() => setOpen(false)}
                                        onConfirm={() => deleteFile(file)}
                                        message={type.selectedFile}
                                        title={type.title}
                                        type={type.type}


                                    /></>

                                {file.isPublic && (
                                    <button
                                        title="View"
                                        className="text-green-400 hover:text-green-600"
                                    >
                                        <Eye size={18} />
                                    </button>
                                )}

                            </div>

                        </div>
                    ))
                }


            </div>

        </>
    )
}

export default ListCard
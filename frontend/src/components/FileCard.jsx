import React, { useState } from 'react'
import { Copy, Download, Eye, FileIcon, FileText, Globe, Image, Lock, Music, Trash2, Video } from 'lucide-react';
import ConfirmationDialog from './ConfirmationDialog';
import CopyLinkModal from './CopyLinlModal';
function FileCard({ file, togglePublic, setOpen1, setOpen, handleClick, handleDelete, downloadFile, open, type, open1, deleteFile, getFileIcon }) {

  const [showActions, setShowActions] = useState(false);


  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }


  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="relative group overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
      {/* file preview area */}
      <div className='h-32 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4'>
        {getFileIcon(file)}
      </div>
      {/* public private bandage*/}
      <div className='absolute top-2 right-2'>
        <div className={`rounded-full p-1.5 ${file.isPublic ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} text-xs font-medium absolute top-3 right-3`}
          title={file.isPublic ? 'Public File' : 'Private File'}>
          {file.isPublic ? (
            <Globe size={14} className='text-green-600' />
          ) :
            <Lock size={14} className='text-red-600' />}

        </div>
      </div>
      {/* file details */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="overflow-hidden">
            <h3 title={file.name} className="font-medium text-gray-900 truncate">
              {file.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(file.size)} • {formatDate(file.uploadAt)}
            </p>
          </div>
        </div>
      </div>
      {/* action buttons */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-end justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
        {/* content here */}
        <div className="flex gap-3 w-full justify-center">
          {file.isPublic && (
            <>
              <button
                onClick={() => setOpen1(true)}
                className='p-2 bg-white/90 rounded-full hover:bg-white transition-colors cursor-pointer text-purple-500 hover:text-purple-600'>
                <Copy size={18} />
              </button>

              <CopyLinkModal
                open={open1}
                onClose={() => setOpen1(false)}
                link={`${window.location.origin}/file/${file.id}`}
              />
            </>

          )}
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
          <>
            <button
              onClick={() => handleClick(file)}
              title="Download"
              className="p-2 bg-white/90 rounded-full cursor-pointer hover:bg-white transition-colors text-green-600 hover:text-green-700">
              <Download size={18} />
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

          <button
            onClick={() => togglePublic(file)}
            title={file.isPublic ? "Make Private" : "Make Public"}
            className="p-2 bg-white/90 rounded-full cursor-pointer hover:bg-white transition-colors text-amber-600 hover:text-amber-700">
            {file.isPublic ? <Globe size={18} /> : <Lock size={18} />}
          </button>
          <>
            <button
              onClick={() => handleDelete(file)}
              title="Delete" className="p-2 bg-white/90 rounded-full cursor-pointer hover:bg-white transition-colors text-red-600 hover:text-red-700">
              <Trash2 size={18} />
            </button>
            <ConfirmationDialog
              open={open}
              onClose={() => setOpen(false)}
              onConfirm={() => deleteFile(file)}
              message={type.selectedFile}
              title={type.title}
              type={type.type}


            />
          </>
        </div>
      </div>
    </div>
  );

}

export default FileCard
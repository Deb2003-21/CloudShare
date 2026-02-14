import React, { useContext, useState } from 'react'
import Dashboard_layout from '../layout/Dashboard_layout'
import { AlertCircle, UploadIcon } from 'lucide-react';
import axios from 'axios';
import { ENDPOINTS } from '../endpoints';
import { useAuth } from '@clerk/clerk-react';
import { UserCreditsContext } from '../components/UserCreditsContext';
import UploadBox from '../components/UploadBox';
import toast from 'react-hot-toast';

function Upload() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" | "error"
    const MAX_FILES = 5;

    // Contexts
    const { getToken } = useAuth();
    const { credits, updateCredits } = useContext(UserCreditsContext);

    // Handlers 
    const handleFileChange = (e) => {
        const selectedfiles = Array.from(e.target.files)
        if (files.length + selectedfiles.length > MAX_FILES) {
            setMessage(`you can upload a maximum of ${MAX_FILES} at once`);
            setMessageType("error")
            return;
        }
        setFiles((prev) => [...prev, ...selectedfiles]);
        setMessage("");
        setMessageType("");

    };

    const handleRemoveFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i != index));
        setMessage("");
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            setMessageType("error")
            setMessage("select one file to upload")
            return;
        }
        if (files.length > MAX_FILES) {
            setMessage(`you can upload a maximum of ${MAX_FILES} at once`);
            return;
        }
        setUploading(true);
        setMessage("uploading files...")
        setMessageType("info")

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file))
        try {
            const token = await getToken();

            const headers = {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            };

            const res = await axios.post(ENDPOINTS.UPLOAD_FILE, formData, {
                headers
            });
            if (res.data && res.data.remainingCredits != undefined) {
                console.log(res.data)
                updateCredits(res.data.remainingCredits.credits)
            }
            setMessage("files uploaded successfully")
            setFiles("success")
            setFiles([])
            setUploading(false)
        } catch (error) {
            // handle error
            toast.error("failed to upload", error.message)
        }

    };

    const isUploadDisabled = credits <= 0 || files.length > 5;

    return (
        <Dashboard_layout activeMenu="Upload">
            <div className="p-6">
                {message && (

                    <div
                        className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${messageType === 'error' ? 'bg-red-50 text-red-700' : messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                            }`}
                    >
                        {messageType === 'error' && <AlertCircle size={20} />}
                        {message}
                    </div>
                )}
                <UploadBox
                    files={files}
                    onFileChange={handleFileChange}
                    onUpload={handleUpload}
                    uploading={uploading}
                    onRemoveFile={handleRemoveFile}
                    remainingCredits={credits}
                    isUploadDisabled={isUploadDisabled}
                />
            </div>
        </Dashboard_layout>

    )
}

export default Upload
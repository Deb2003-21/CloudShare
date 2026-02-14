import React, { useEffect, useState } from "react";
import axios from "axios";
import Dashboard_layout from "../layout/Dashboard_layout";
import { Copy, Download, DownloadCloud, DownloadIcon, Eye, File, FileIcon, FileText, Globe, Grid, Image, Link, List, Lock, Music, Trash2, Trash2Icon, Video } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import FileCard from "../components/FileCard";
import { ENDPOINTS } from "../endpoints";
import ConfirmationDialog from "../components/ConfirmationDialog";
import CopyLinkModal from "../components/CopyLinlModal";
import ListCard from "../components/ListCard";

function MyFiles() {
    const [files, setFiles] = useState([]);
    const [viewMode, setViewMode] = useState("list");
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const { getToken } = useAuth();
    const [type, setType] = useState({
        type: "info",
        selectedFile: "",
        title: null
    });

    {/* displaying icons */ }
    const getFileIcon = (file) => {
        const extension = file.name.split('.').pop().toLowerCase();


        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
            return <Image size={24} className="text-purple-500" />;
        }

        if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
            return <Video size={24} className="text-blue-500" />;
        }

        if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extension)) {
            return <Music size={24} className="text-green-500" />
        }

        if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
            return <FileText size={24} className="text-green-500" />
        }
        return <FileIcon size={24} className="text-purple-500" />

    }


    const navigate = useNavigate();

    // handles the click on download button and opens the confirmation dialog
    const handleClick = (file) => {
        setOpen(true);
        setType({
            type: "info",
            selectedFile: `Do you want to download ${file.name}?`,
            title: "Download File"
        });

    };


    // handles the click on delete button and opens the confirmation dialog
    const handleDelete = (file) => {
        setOpen(true);
        setType({
            type: "danger",
            selectedFile: `Do you want to delete ${file.name}?`,
            title: "Delete File"
        });

    };



    // Fetching files from backend
    const fetchFiles = async () => {
        try {
            const token = await getToken();

            const res = await axios.get(ENDPOINTS.FETCH_FILES, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                setFiles(res.data);
            }

        } catch (err) {
            toast.error("Failed to fetch files", {
                description: err.message,
            });
        }
    };

    // handle file deletion
    const deleteFile = async (fileid) => {
        try {
            const token = await getToken();
            const res = await axios.delete(ENDPOINTS.DELETE_FILE(fileid.id), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.status === 204) {
                // remove the file from state
                setFiles(file => file.filter(file => file.id !== fileid.id));
                toast.success("File deleted successfully");
            }
            setOpen(false);
        } catch (err) {
            toast.error("Failed to delete file", {
                description: err.message,
            });
        }
    }

    //handle file download
    const downloadFile = async (fileid) => {
        try {
            const token = await getToken();
            const res = await axios.get(ENDPOINTS.DOWNLOAD_FILE(fileid.id), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });
            if (res.status === 200) {
                // Create a download link for the file
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileid.name);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);// free up memory
                setOpen(false);
            }
        }
        catch (err) {
            toast.error("Failed to download file", {
                description: err.message,
            });
        }
    }

    // toggles the public/private status of a file
    const togglePublic = async (fileToUpdate) => {

        try {
            const token = await getToken();
            const res = await axios.patch(ENDPOINTS.TOGGLE_PUBLIC(fileToUpdate.id), {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.status === 200) {

                // update the file in state
                setFiles(file => file.map(file => file.id === fileToUpdate.id ? { ...file, isPublic: !file.isPublic } : file))
            }

        } catch (err) {
            toast.error("Failed to toggle public status", {
                description: err.message,
            });
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [getToken]);

    return (
        <Dashboard_layout activeMenu="My Files">
            <div className="p-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            My Files
                        </h2>
                        <p className="text-sm text-gray-500">
                            {files.length} files uploaded
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white border rounded-lg p-1 shadow-sm">

                        <List
                            onClick={() => setViewMode("list")}
                            size={22}
                            className={`cursor-pointer p-1 rounded 
                ${viewMode === "list"
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-500 hover:text-gray-700"}`}
                        />

                        <Grid
                            onClick={() => setViewMode("grid")}
                            size={22}
                            className={`cursor-pointer p-1 rounded 
                ${viewMode === "grid"
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-gray-500 hover:text-gray-700"}`}
                        />
                    </div>
                </div>

                {/* Empty State */}
                {files.length === 0 && (
                    <div className="bg-white rounded-xl shadow p-12 flex flex-col items-center text-center">

                        <File size={52} className="text-blue-400 mb-4" />

                        <h3 className="text-lg font-semibold mb-1">
                            No files uploaded
                        </h3>

                        <p className="text-gray-500 mb-6 max-w-sm">
                            Upload your documents, images, and files to manage them here.
                        </p>

                        <button
                            onClick={() => navigate("/upload")}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Upload Files
                        </button>
                    </div>
                )}

                {/* Grid View */}
                {files.length > 0 && viewMode === "grid" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                        {files.map((file, index) => (
                            <FileCard key={index} type={type} file={file} togglePublic={togglePublic} setOpen1={setOpen1} setOpen={setOpen} handleClick={handleClick}
                                handleDelete={handleDelete} downloadFile={downloadFile} open1={open1} deleteFile={deleteFile} open={open} getFileIcon={getFileIcon} />
                        ))}
                    </div>
                )}

                {/* List View */}

                {files.length > 0 && viewMode === "list" && (
                    <ListCard type={type} files={files} togglePublic={togglePublic} setOpen1={setOpen1} setOpen={setOpen} handleClick={handleClick}
                        handleDelete={handleDelete} downloadFile={downloadFile} open1={open1} deleteFile={deleteFile} open={open} getFileIcon={getFileIcon} />
                )}


            </div>
        </Dashboard_layout>
    );
}

export default MyFiles;

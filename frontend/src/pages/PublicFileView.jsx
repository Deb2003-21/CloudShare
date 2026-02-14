import React, { useEffect, useState } from "react";
import { ENDPOINTS } from "../endpoints";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";



const PublicFileView = () => {

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);



    // Get fileId from URL
    const { fileId } = useParams();

    /* ===============================
        Fetch File From Backend
    ================================ */
    useEffect(() => {

        const fetchFile = async () => {

            try {

                setLoading(true);

                const response = await axios.get(
                    ENDPOINTS.GET_FILE(fileId),
                    {
                        responseType: "blob",
                    }
                );

                // Create URL from blob
                const blobUrl = URL.createObjectURL(response.data);

                // Get mime type from header
                const mimeType = response.headers["content-type"];

                console.log("MIME:", mimeType);

                // Block executables (extra safety)
                if (
                    mimeType?.includes("application/x-msdownload") ||
                    mimeType?.includes("application/x-msdos-program")
                ) {
                    toast.error("This file is not allowed");
                    return;
                }


                setFile({
                    url: blobUrl,
                    type: mimeType,
                });

            } catch (err) {

                console.error(err);
                toast.error("Failed to load file");

            } finally {

                setLoading(false);

            }
        };

        if (fileId) {
            fetchFile();
        }

    }, [fileId]);


    /* ===============================
          Render Preview
    ================================ */
    const renderPreview = () => {

        if (!file) return null;

        const type = file.type || "";

        /* Images */
        if (type.startsWith("image/")) {
            return (
                <img
                    src={file.url}
                    alt="preview"
                    className="max-h-full mx-auto rounded"
                />
            );
        }

        /* Videos */
        if (type.startsWith("video/")) {
            return (
                <video controls className="w-full h-full rounded">
                    <source src={file.url} type={type} />
                </video>
            );
        }

        /* Text */
        if (type.startsWith("text/") || type === "application/json" || type === "application/pdf") {
            return (
                <iframe
                    src={file.url}
                    title="text-preview"
                    className="w-full h-full"
                />
            );
        }


        /* Fallback */
        return (
            <div className="text-center text-gray-500">
                <iframe
                    src={file.url}
                />
                Preview not available. Download to view.
            </div>
        );
    };

    /* ===============================
              UI
    ================================ */
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">

            {/* Loader */}
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin mr-2" size={24} />
                    <span>Loading your file, please wait...</span>
                </div>
            )}

            {/* Main Content */}
            {!loading && (
                <>
                    <h2 className="text-xl md:text-2xl font-semibold text-center mb-4">
                        File Viewer
                    </h2>



                    {/* Preview */}
                    {file && (
                        <div className="mt-6 max-w-4xl mx-auto bg-white p-4 rounded-xl shadow">

                            <h3 className="font-medium mb-3">
                                Preview
                            </h3>

                            <div className="h-[400px] md:h-[600px] overflow-auto border rounded">

                                {renderPreview()}

                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PublicFileView;
import React, { useState, useEffect } from "react";
import { FaSpinner, FaDownload, FaExpand, FaTimes } from "react-icons/fa";
import { useAuth } from "../../Contexts/AuthContext";
import { apiCall } from "../../services/globalService";

const api = import.meta.env.VITE_API_URL;

const ClientEngagement = () => {
  const { user, loading, accessToken } = useAuth();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (user?.dataId && accessToken) {
      fetchDocument(user.dataId);
    }
  }, [user, accessToken]);

  //here use data id stord in the token not id

  const fetchDocument = async (clientId) => {
    setLoadingPdf(true);
    setError("");
    try {
      // Backend now serves the PDF directly with authentication
      const pdfEndpoint = `${api}/clients/${clientId}/engagement?token=${accessToken}`;
      setPdfUrl(pdfEndpoint);
      //console.log("PDF URL:", pdfEndpoint);
    } catch (error) {
      console.error("Error fetching document:", error);
      setError("Failed to load document.");
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading || loadingPdf) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
        <p className="text-gray-600">Loading PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => fetchDocument(user?.id)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
        <div className="bg-white p-3 flex justify-between items-center">
          <h3 className="font-semibold">Letter of Engagement</h3>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <FaTimes />
          </button>
        </div>
        <iframe
          src={pdfUrl}
          className="flex-1 w-full"
          title="Engagement Letter"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-600 mt-4">
        Letter of Engagement
      </h2>
      {pdfUrl ? (
        <div className="w-full max-w-3xl border shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-2 flex justify-end gap-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <FaDownload />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-200 rounded"
            >
              <FaExpand />
            </button>
          </div>
          <iframe
            src={pdfUrl}
            className="w-full"
            style={{ height: "600px" }}
            title="PDF Viewer"
          />
        </div>
      ) : (
        <p className="text-red-500">No document available.</p>
      )}
    </div>
  );
};

export default ClientEngagement;

import React, { useState, useEffect } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { FaSpinner } from "react-icons/fa";
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist/build/pdf"; // ✅ FIXED IMPORT

// ✅ Correctly set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const api = import.meta.env.VITE_API_URL;

const ClientEngagement = () => {
  const { user, loading } = useAuth();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError] = useState("");

  const defaultLayout = defaultLayoutPlugin();

  useEffect(() => {
    if (user?.dataId) {
      fetchDocument(user?.dataId);
    }
  }, [user]);

const fetchDocument = async (clientId) => {
  setLoadingPdf(true);
  setError("");

  try {
    const response = await axios.get(`${api}/clients/${clientId}/engagement`); // FIXED
    if (response.data.url) {
      setPdfUrl(response.data.url);
    } else {
      setError("No PDF URL received.");
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    setError(error?.response?.data?.message || "Failed to load document.");
  } finally {
    setLoadingPdf(false);
  }
};


  if (loading || loadingPdf) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-gray-500" />
        <p className="text-gray-600">Loading PDF...</p>
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
          <Viewer fileUrl={pdfUrl} plugins={[defaultLayout]} />
        </div>
      ) : (
        <p className="text-red-500">{error || "No document available."}</p>
      )}
    </div>
  );
};

export default ClientEngagement;

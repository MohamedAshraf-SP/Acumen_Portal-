import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon
import { useAuth } from "../../Contexts/AuthContext";
import axios from "axios";
const api = import.meta.env.VITE_API_URL;
const ClientEngagement = () => {
  const { user, loading } = useAuth();
  const [pdfUrl, setPdfUrl] = useState(null);
  console.log(user);
  // React PDF Viewer plugin (adds zoom, download, and print)
  const defaultLayout = defaultLayoutPlugin();

  useEffect(() => {
    if (user?.id) {
      fetchDocument(user.id);
    }
  }, [user]);

  const fetchDocument = async (userId) => {
    try {
      // Replace with your actual API call or Firebase storage retrieval
      const response = await axios.get(`${api}/clients/${userId}/engagement`);
      console.log(response);
      const data = await response;
      setPdfUrl(data.pdfUrl); // URL of the stored PDF
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold mb-4">Letter of Engagement</h2>
      {pdfUrl ? (
        <div className="w-full max-w-3xl border shadow-lg">
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}
          >
            <Viewer fileUrl={pdfUrl} plugins={[defaultLayout]} />
          </Worker>
        </div>
      ) : (
        <p>No document available</p>
      )}
    </div>
  );
};

export default ClientEngagement;

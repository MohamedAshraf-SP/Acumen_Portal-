import axios from "axios";
const api = import.meta.env.VITE_API_URL || "http://localhost:3000";
// format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year}   ${hours}:${minutes}:${seconds}`;
};

// download documents Func
export const handleDownloadPdf = async (documentId, path) => {
  try {
    const response = await axios.get(`${api}/${path}/${documentId}`, {
      responseType: "blob", // This is critical for handling file downloads
    });

    // Create a Blob from the response data
    const url = window.URL.createObjectURL(new Blob([response.data]));
    // Create a link element for downloading the file
    const link = document.createElement("a");
    link.href = url;
    // Set the file name (you may get it from the response headers or hardcode it)
    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1].replace(/"/g, "")
      : `download_${documentId}.pdf`;

    link.setAttribute("download", filename);

    // Append the link to the body, trigger click, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    alert("sorry error happened while downloading the file,try again");
    console.error("Error downloading file:", error);
  }
};

// format displaying number
export const formatNum = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // For millions
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k"; // For thousnads
  } else {
    return num;
  }
};

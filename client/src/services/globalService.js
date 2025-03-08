import axios from "axios";
const api = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Centralized error handling function
const handleError = (error, action) => {
  console.error(`Error in ${action}:`, error?.response || error.message);
  throw new Error(
    `Sorry, ${error?.response?.data?.message || "an error occurred"}`
  );
};

// Generic API call
const apiCall = async (
  method,
  path,
  page = null,
  limit = null,
  data = null,
  headers = {}
) => {
  const config = {
    method,
    url: `${api}/${path}${page && limit ? `?page=${page}&limit=${limit}` : ""}`,
    data,
    headers: { ...headers },
  };

  try {
    // If data is FormData, set the Content-Type header to multipart/form-data
    if (data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    const response = await axios(config);

    return response.data;
  } catch (error) {
    console.log("API Error:", error);
    handleError(error, method);
  }
};

// get All Items
export const getAllItems = (path, page, limit) => {
  return apiCall("GET", path, page, limit);
};

// get One Item
export const getItem = (path, itemId) => {
  return apiCall("GET", `${path}/${itemId}`);
};

// get Count
export const getCount = (path) => {
  return apiCall("GET", `${path}/count`);
};

// add Item
export const addItem = (path, data) => {
  return apiCall("POST", path, null, null, data);
};

// add Item with form data
export const addItemWithFiles = (path, data) => {
  console.log("Path:", path);
 return apiCall("POST", path, null, null, data);
};

// update Item
export const updateItem = (path, itemId, data) => {
  return apiCall("PUT", `${path}/${itemId}`, null, null, data);
};

// delete Item
export const deleteItem = (path, itemId) => {
  return apiCall("DELETE", `${path}/${itemId}`);
};

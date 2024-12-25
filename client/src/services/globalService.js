import axios from "axios";
const api = import.meta.env.VITE_API_URL;
// Centralized error handling function
const handleError = (error, action) => {
  console.log(error);
  throw new Error(`Sorry,${error?.response?.data?.message}`);
};
// Generic API call
const apiCall = async (method, path, data = null, headers = {}) => {
  try {
    const response = await axios({
      method,
      url: `${api}/${path}`,
      data,
      headers, // Include headers here
    });
    return response.data;
  } catch (error) {
    handleError(error, method);
    throw error; // Re-throw the error for upstream handling
  }
};

// get All Items
export const getAllItems = (path) => {
  return apiCall("GET", path);
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
  // Call the API
  return apiCall("POST", path, data, {
    "Content-Type": "multipart/form-data",
  });
};

// update Item
export const updateItem = (path, itemId, data) => {
  return apiCall("PUT", `${path}/${itemId}`, data);
};
// delete Item
export const deleteItem = (path, itemId) => {
  return apiCall("DELETE", `${path}/${itemId}`);
};

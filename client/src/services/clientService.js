import axios from "axios";

const api = import.meta.env.VITE_API_URL;
// Centralized error handling function
const handleError = (error, action) => {
  throw new Error(`${action}:sorry error is ${error.message}`);
};
// Generic API call
const apiCall = async (method, path, data) => {
  try {
    const response = await axios({ method, url: `${api}/${path}`, data });
    return response.data;
  } catch (error) {
    handleError(error, method);
  }
};
// Get All Companies Of Client
const getAllCompanies = (itemId) => {
  return apiCall("GET", `clients/${itemId}/companies`);
};

//Get Department Of Clients
const getClientDepartment = () => {};

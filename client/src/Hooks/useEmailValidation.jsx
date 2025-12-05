const api = import.meta.env.VITE_API_URL;
import axios from "axios";
import { useState } from "react";
import { useDebounce } from "./useDebounce";
import * as Yup from "yup";

export const checkEmailAvailability = async (email) => {
  try {
    const response = await axios.post(`${api}/helpers/checkemail`, { email });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const useEmailValidation = () => {
  const [validation, setValidation] = useState({
    loading: false,
    valid: null,
    message: "",
  });

  const checkEmail = useDebounce(async (formik, email) => {
    if (!email) {
      setValidation({
        loading: false,
        valid: null,
        message: "",
      });
      return;
    }
    const isValidEmail = await Yup.string().email().isValid(email);
    if (!isValidEmail) {
      setValidation({
        loading: false,
        valid: false,
        message: "",
      });
      return;
    }

    setValidation({
      loading: true,
      valid: null,
      message: "Checking...",
    });

    const isAvailable = await checkEmailAvailability(email);
    setValidation({
      loading: false,
      valid: isAvailable,
      message: isAvailable
        ? "✔ Email is available!"
        : "❌ Email already exists!",
    });
  }, 500);
  const resetValidation = () => {
    setValidation({
      loading: false,
      valid: null,
      message: "",
    });
  };
  return { validation, checkEmail, resetValidation };
};

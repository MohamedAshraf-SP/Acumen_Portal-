import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addNewData } from "../Rtk/slices/addNewSlice";
import Skeleton from "react-loading-skeleton";
import axios from "axios";

export default function AddClientForm() {
  const routes = ["Clients", "Add Client"];
  const api = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const status = useSelector((state) => state.AddNew.status); // check adding status
  const [alert, setAlert] = useState({ msg: "", showmsg: false }); // toggle show or hide alert
  const [emailValidation, setEmailValidation] = useState({
    loading: false,
    valid: null,
    message: "",
  }); // state handle email validation
  const [fileName, setFileName] = useState(""); //carry uploaded file name
  // Helper to check email availability
  const checkEmailAvailability = async (email) => {
    setEmailValidation({ loading: true, valid: null, message: "" });
    try {
      const response = await axios.post(`${api}/helpers/checkemail`, { email });
      const { status } = response;
      setEmailValidation({
        loading: false,
        valid: status === 200,
        message: status === 200 && "Email is available.",
      });
    } catch (error) {
      setEmailValidation({
        loading: false,
        valid: false,
        message: "Email already exists.",
      });
    }
  };

  // Debounced email validation
  const debouncedValidateEmail = useMemo(
    () => _.debounce(checkEmailAvailability, 500),
    []
  );
  // clear debouncedValidateEmail
  useEffect(() => {
    return () => debouncedValidateEmail.cancel();
  }, [debouncedValidateEmail]);

  // -----Detect changing in input
  const handleEmailChange = (e) => {
    formik.handleChange(e);
    const email = e.target.value;
    if (email && Yup.string().email().isValidSync(email)) {
      debouncedValidateEmail(email);
    } else {
      setEmailValidation({ loading: false, valid: null, message: "" });
    }
  };
  // for handle upload file
  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      setFileName(file.name);
      formik.setFieldValue("LOEfile", file);
    } else {
      setFileName("");
    }
  };
  const resetForm = () => {
    formik.resetForm();
    setFileName("");
    setEmailValidation({
      loading: false,
      valid: null,
      message: "",
    });
    setAlert({ msg: "", showmsg: false });
  };
  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      notification: 1,
      department: "Finance department",
      LOEfile: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter client name."),
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter a valid email."),
      LOEfile: Yup.mixed()
        .required("Please select a file.")
        .test(
          "fileSize",
          "File size should not exceed 15MB.",
          (value) => value && value.size <= 15 * 1024 * 1024
        )
        .test(
          "fileFormat",
          "Unsupported file format. Only PDF is allowed.",
          (value) => value && value.type === "application/pdf"
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("notification", values.notification);
      formData.append("department", values.department);
      formData.append("LOEfile", values.LOEfile);

      try {
        // Enhancement 1: Properly handle thunk dispatch result
        const result = await dispatch(
          addNewData({ path: "clients", itemData: formData })
        ).unwrap();
console.log(result)
        // Enhancement 2: Access status from Redux state instead of local variable
        const status =
          result.meta?.requestStatus === "fulfilled" ? "success" : "failed";

        // Enhancement 3: Better success handling
        if (status === "success") {
          setAlert({ msg: "Client added successfully", showmsg: true });
          resetForm(); // Move resetForm to success case if desired
        }

        console.log("Submission result:", result);
        return result; // Optional: return result for further processing
      } catch (error) {
        // Enhancement 4: Improved error handling
        console.error("Submission failed:", error);
        setAlert({
          msg: error.message || "Failed to add client",
          showmsg: true,
        });
        resetForm();
      } finally {
        // Enhancement 5: Consistent cleanup
        setEmailValidation({
          loading: false,
          valid: null,
          message: "",
        });
      }
    },
  });

  return (
    <div className="dark:bg-secondary-dark-bg rounded-md h-full">
      <header>
        <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]">
          Create New Client
        </h1>
        <ul className="flex items-center space-x-1 text-sm py-2">
          {routes.map((route, index) => (
            <li
              key={index}
              className={`flex items-center ${
                index === routes.length - 1
                  ? "text-gray-400"
                  : "text-slate-900 dark:text-gray-200"
              }`}
            >
              {index > 0 && (
                <LuDot className="text-lg text-gray-400 font-bold" />
              )}
              {route}
            </li>
          ))}
        </ul>
      </header>

      {alert.showmsg && (
        <div>
          {status === "loading" ? (
            <Skeleton height="2rem" width="100%" className="mb-2" />
          ) : (
            <div
              className={`p-4 mb-4 text-sm rounded-xl font-normal flex items-center justify-between ${
                status === "success"
                  ? "text-green-700 bg-green-100"
                  : "bg-red-50 text-red-500"
              }`}
              role="alert"
            >
              <span className="font-semibold">{alert.msg}</span>
              <IoIosCloseCircleOutline
                className="cursor-pointer text-slate-700 text-xl hover:text-slate-400 transition"
                onClick={() => setAlert({ ...alert, showmsg: false })}
              />
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg max-w-[700px] mx-auto border border-solid border-[#43464933] shadow-md">
        <header className="bg-gray-50">
          <h2 className="text-lg font-medium dark:text-gray-200 py-2 px-4 text-slate-700">
            Add Client
          </h2>
          <hr className="border-t border-[#919eab33]" />
        </header>

        <form
          className="p-4 flex flex-col gap-4 my-4"
          onSubmit={formik.handleSubmit}
        >
          {/* Name Input */}
          <div className="relative w-full mb-4">
            <label htmlFor="clientName" className=" customlabel text-gray-900">
              client Name
            </label>
            <input
              id="clientName"
              name="name"
              className="peer input block"
              type="text"
              placeholder=""
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {/* <label htmlFor="clientName" className="customlabel text-gray-700">
              Client Name
            </label> */}
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-600 italic mt-1 text-[12px]">
                {formik.errors.name}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="relative w-full mb-4">
            <label htmlFor="clientEmail" className="customlabel text-gray-700">
              Email
            </label>
            <input
              id="clientEmail"
              name="email"
              className="peer input block"
              type="email"
              placeholder=""
              onChange={handleEmailChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              aria-live="polite"
            />

            {formik.touched.email && formik.errors.email && (
              <p className="text-red-600 italic mt-1 text-[12px]">
                {formik.errors.email}
              </p>
            )}
            {emailValidation.loading && (
              <img
                className="w-4 h-4 animate-spin"
                src="https://www.svgrepo.com/show/474682/loading.svg"
                alt="Loading icon"
              />
            )}
            {emailValidation.message && (
              <p
                className={`text-xs italic mt-1 ${
                  emailValidation.valid ? "text-green-600" : "text-red-600"
                }`}
              >
                {emailValidation.message}
              </p>
            )}
          </div>

          {/* File Input */}
          <div className="w-full mb-5">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center py-9 w-full border border-gray-300 border-dashed rounded-lg cursor-pointer bg-[#F7F7F7] hover:bg-[#F1F5F9]"
            >
              <div className="text-center">
                <svg
                  aria-hidden="true"
                  className="mb-3 w-12 h-12 mx-auto   text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V12m0-4V4m0 12H3m4-4H1M17 16v-4m0-4v-4m0 12h4m-4-4h6"
                  />
                </svg>
                {fileName ? (
                  <span className="text-green-600  mt-2 text-sm">
                    {fileName}
                  </span>
                ) : (
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> Your
                    Item here
                  </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF (Max: 15MB)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>

            {formik.touched.LOEfile && formik.errors.LOEfile && (
              <p className="text-red-600 italic mt-1 text-[12px]">
                {formik.errors.LOEfile}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end md:flex-row flex-col md:gap-4 gap-2">
            <button
              type="submit"
              className={`blackbutton ${
                emailValidation.valid === false ||
                !formik.isValid ||
                status == "loading"
                  ? "cursor-not-allowed opacity-50  bg-blue-500"
                  : "bg-blue-500 cursor-pointer"
              }`}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Adding..." : "Add Client"}
            </button>
            <button
              type="reset"
              className=" bg-[#efeff0] px-4 font-normal rounded-md "
              onClick={resetForm}
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

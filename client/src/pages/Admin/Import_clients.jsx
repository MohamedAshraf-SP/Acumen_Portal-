import axios from "axios";
import { useState } from "react";
// Import images
import failedUploadimg from "/images/load_Client/failed_Load.webp";
// Import formik & Yup
import { useFormik } from "formik";
import * as Yup from "yup";
// Import icons
import { LuDot } from "react-icons/lu";
import { IoCloudUpload } from "react-icons/io5";

const Import_clients = () => {
  const api = import.meta.env.VITE_API_URL;
  const routes = ["Dashboard", "Import Clients"]; //display routs in top of the page
  const [fileName, setFileName] = useState(""); // store uploaded file name
  const [status, setStatus] = useState(""); // store uploading status
  const [uploadError, setUploadError] = useState(""); //store if there is an error
  const [result, setResult] = useState([]); //store result after api call

  // Handle file input change

  const handleFileChange = (e) => {
    setStatus("");
    const file = e.currentTarget?.files[0];
    if (file) {
      setFileName(file.name);
      formik.setFieldValue("clients", file);
    } else {
      setFileName("");
    }
    e.target.value = ""; // Reset file input value
  };

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      clients: "",
      start: "",
      end: "",
    },
    validationSchema: Yup.object({
      start: Yup.number().min(0, "Start row must be a positive number"),
      end: Yup.number().min(0, "End row must be a positive number"),
      clients: Yup.mixed()
        .required("Please select a file.")
        .test("fileType", "Only CSV files are allowed", (value) => {
          return value && value.type === "text/csv";
        }),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setStatus("loading");
        const formData = new FormData();
        formData.append("clients", values.clients);
        formData.append("start", values.start);
        formData.append("end", values.end);

        // Make the API call
        const response = await axios.post(
          `${api}/helpers/importCSV?start=${values.start}&end=${values.end}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.status === 200) {
          setResult(response.data);
          setStatus("success");
          setUploadError(null);
        }
      } catch (error) {
        setStatus("failed");
        setUploadError(
          error.response?.data?.message ||
            "Failed to upload the file. Please try again."
        );
        console.log(error);
      } finally {
        // Reset the form, including the file input
        resetForm();
        setFileName(""); // Clear the file name displayed
      }
    },
  });

  return (
    <div className="my-8 py-4 px-4 rounded-lg shadow-sm dark:bg-secondary-dark-bg dark:text-gray-200">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-xl font-semibold">Import Clients</h1>
        <ul className="flex flex-row items-center space-x-1 text-sm py-2">
          {routes.map((route, index) => (
            <li
              key={index}
              className={`flex flex-row items-center ${
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
      </div>

      {/* Form */}
      <div className="border-none">
        <form onSubmit={formik.handleSubmit}>
          <div className="gap-5 grid lg:grid-cols-2">
            {/* File Upload Section */}
            <div className="w-full py-9 bg-[linear-gradient(135deg,_#f5f7fa_0%,_#c3cfe2_100%)] rounded-2xl border border-gray-300 border-dashed h-[260px]">
              <div className="grid gap-3">
                <svg
                  className="mx-auto"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M31.6497 10.6056L32.2476 10.0741L31.6497 10.6056ZM28.6559 7.23757L28.058 7.76907L28.058 7.76907L28.6559 7.23757ZM26.5356 5.29253L26.2079 6.02233L26.2079 6.02233L26.5356 5.29253ZM33.1161 12.5827L32.3683 12.867V12.867L33.1161 12.5827ZM31.8692 33.5355L32.4349 34.1012L31.8692 33.5355ZM24.231 11.4836L25.0157 11.3276L24.231 11.4836ZM26.85 14.1026L26.694 14.8872L26.85 14.1026ZM11.667 20.8667C11.2252 20.8667 10.867 21.2248 10.867 21.6667C10.867 22.1085 11.2252 22.4667 11.667 22.4667V20.8667ZM25.0003 22.4667C25.4422 22.4667 25.8003 22.1085 25.8003 21.6667C25.8003 21.2248 25.4422 20.8667 25.0003 20.8667V22.4667ZM11.667 25.8667C11.2252 25.8667 10.867 26.2248 10.867 26.6667C10.867 27.1085 11.2252 27.4667 11.667 27.4667V25.8667ZM20.0003 27.4667C20.4422 27.4667 20.8003 27.1085 20.8003 26.6667C20.8003 26.2248 20.4422 25.8667 20.0003 25.8667V27.4667ZM23.3337 34.2H16.667V35.8H23.3337V34.2ZM7.46699 25V15H5.86699V25H7.46699ZM32.5337 15.0347V25H34.1337V15.0347H32.5337ZM16.667 5.8H23.6732V4.2H16.667V5.8ZM23.6732 5.8C25.2185 5.8 25.7493 5.81639 26.2079 6.02233L26.8633 4.56274C26.0191 4.18361 25.0759 4.2 23.6732 4.2V5.8ZM29.2539 6.70608C28.322 5.65771 27.7076 4.94187 26.8633 4.56274L26.2079 6.02233C26.6665 6.22826 27.0314 6.6141 28.058 7.76907L29.2539 6.70608ZM34.1337 15.0347C34.1337 13.8411 34.1458 13.0399 33.8638 12.2984L32.3683 12.867C32.5216 13.2702 32.5337 13.7221 32.5337 15.0347H34.1337ZM31.0518 11.1371C31.9238 12.1181 32.215 12.4639 32.3683 12.867L33.8638 12.2984C33.5819 11.5569 33.0406 10.9662 32.2476 10.0741L31.0518 11.1371ZM16.667 34.2C14.2874 34.2 12.5831 34.1983 11.2872 34.0241C10.0144 33.8529 9.25596 33.5287 8.69714 32.9698L7.56577 34.1012C8.47142 35.0069 9.62375 35.4148 11.074 35.6098C12.5013 35.8017 14.3326 35.8 16.667 35.8V34.2ZM5.86699 25C5.86699 27.3344 5.86529 29.1657 6.05718 30.593C6.25217 32.0432 6.66012 33.1956 7.56577 34.1012L8.69714 32.9698C8.13833 32.411 7.81405 31.6526 7.64292 30.3798C7.46869 29.0839 7.46699 27.3796 7.46699 25H5.86699ZM23.3337 35.8C25.6681 35.8 27.4993 35.8017 28.9266 35.6098C30.3769 35.4148 31.5292 35.0069 32.4349 34.1012L31.3035 32.9698C30.7447 33.5287 29.9863 33.8529 28.7134 34.0241C27.4175 34.1983 25.7133 34.2 23.3337 34.2V35.8ZM32.5337 25C32.5337 27.3796 32.532 29.0839 32.3577 30.3798C32.1866 31.6526 31.8623 32.411 31.3035 32.9698L32.4349 34.1012C33.3405 33.1956 33.7485 32.0432 33.9435 30.593C34.1354 29.1657 34.1337 27.3344 34.1337 25H32.5337ZM7.46699 15C7.46699 12.6204 7.46869 10.9161 7.64292 9.62024C7.81405 8.34738 8.13833 7.58897 8.69714 7.03015L7.56577 5.89878C6.66012 6.80443 6.25217 7.95676 6.05718 9.40704C5.86529 10.8343 5.86699 12.6656 5.86699 15H7.46699ZM16.667 4.2C14.3326 4.2 12.5013 4.1983 11.074 4.39019C9.62375 4.58518 8.47142 4.99313 7.56577 5.89878L8.69714 7.03015C9.25596 6.47133 10.0144 6.14706 11.2872 5.97592C12.5831 5.8017 14.2874 5.8 16.667 5.8V4.2ZM23.367 5V10H24.967V5H23.367ZM28.3337 14.9667H33.3337V13.3667H28.3337V14.9667ZM23.367 10C23.367 10.7361 23.3631 11.221 23.4464 11.6397L25.0157 11.3276C24.9709 11.1023 24.967 10.8128 24.967 10H23.367ZM28.3337 13.3667C27.5209 13.3667 27.2313 13.3628 27.0061 13.318L26.694 14.8872C27.1127 14.9705 27.5976 14.9667 28.3337 14.9667V13.3667ZM23.4464 11.6397C23.7726 13.2794 25.0543 14.5611 26.694 14.8872L27.0061 13.318C26.0011 13.1181 25.2156 12.3325 25.0157 11.3276L23.4464 11.6397ZM11.667 22.4667H25.0003V20.8667H11.667V22.4667ZM11.667 27.4667H20.0003V25.8667H11.667V27.4667ZM32.2476 10.0741L29.2539 6.70608L28.058 7.76907L31.0518 11.1371L32.2476 10.0741Z"
                    fill="#4F46E5"
                  />
                </svg>
                <div className="grid gap-4">
                  <h2 className="text-center text-gray-400 text-xs font-light leading-4">
                    {formik.values.clients
                      ? fileName
                      : "Select a file to import data from (CSV format only)"}
                  </h2>
                  {!formik.values.clients && (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <h4 className="text-center text-gray-900 text-sm font-medium leading-snug">
                        Drag The File here
                      </h4>
                      <span className="text-center text-gray-400 text-xs font-light leading-4">
                        OR
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-center gap-1">
                    <label>
                      <input
                        type="file"
                        name="clients"
                        id="fileInput"
                        accept=".csv"
                        hidden
                        onChange={handleFileChange}
                        onBlur={formik.handleBlur}
                      />
                      <div className="flex w-28 h-9 px-2 flex-col bg-indigo-600 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                        Upload CSV File
                      </div>
                    </label>
                    {formik.errors.clients && formik.touched.clients && (
                      <div className="text-red-600 italic mt-1 text-[12px] block">
                        {formik.errors.clients}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Start and End Row Inputs */}
            <div className="flex flex-col items-start justify-start my-4 gap-4">
              <div className="w-full">
                <label
                  aria-label="start-row"
                  htmlFor="start-row"
                  className="block text-sm font-medium mb-2 dark:text-white"
                >
                  Start Row
                </label>
                <input
                  id="start-row"
                  type="number"
                  name="start"
                  aria-describedby="start-row-helper"
                  min={0}
                  value={formik.values.start}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 text-black w-full border border-solid border-gray-300 rounded-lg text-sm outline-none focus:border-slate-700 focus:ring-slate-700 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Import from row ?"
                />
                {formik.errors.start && formik.touched.start && (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.start}
                  </div>
                )}
              </div>
              <div className="w-full">
                <label
                  aria-label="end-row"
                  htmlFor="end-row"
                  className="block text-sm font-medium mb-2 text-slate-700 dark:text-white"
                >
                  End Row
                </label>
                <input
                  id="end-row"
                  type="number"
                  name="end"
                  aria-describedby="end-row-helper"
                  min={0}
                  value={formik.values.end}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="py-3 px-4 text-black w-full border border-solid border-gray-300 rounded-lg text-sm outline-none focus:border-slate-600 focus:ring-slate-700 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  placeholder="Till row?"
                />
                {formik.errors.end && formik.touched.end && (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.end}
                  </div>
                )}
              </div>
              <div className="grid lg:grid-cols-2 gap-4 w-full my-4">
                <button
                  type="submit"
                  className={`blackbutton  ${
                    status === "loading"
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  disabled={status === "loading"}
                >
                  {status != "loading" && (
                    <IoCloudUpload className="mr-2" size={16} />
                  )}
                  {status === "loading" ? "Importing..." : "import"}
                </button>
                <button
                  type="button"
                  className="bg-[#efeff0] px-4 font-normal rounded-md"
                  onClick={() => formik.resetForm()}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Status Messages */}
        <div className="w-full gap-1 flex items-center justify-center my-4">
          {status === "loading" && (
            <div className="flex items-center justify-center">
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              <span>Uploading...</span>
            </div>
          )}
          {status === "success" && (
            <div>
              <div className="flex flex-row items-center justify-center">
                <svg
                  className=""
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M31.6497 10.6056L32.2476 10.0741L31.6497 10.6056ZM28.6559 7.23757L28.058 7.76907L28.058 7.76907L28.6559 7.23757ZM26.5356 5.29253L26.2079 6.02233L26.2079 6.02233L26.5356 5.29253ZM33.1161 12.5827L32.3683 12.867V12.867L33.1161 12.5827ZM31.8692 33.5355L32.4349 34.1012L31.8692 33.5355ZM24.231 11.4836L25.0157 11.3276L24.231 11.4836ZM26.85 14.1026L26.694 14.8872L26.85 14.1026ZM11.667 20.8667C11.2252 20.8667 10.867 21.2248 10.867 21.6667C10.867 22.1085 11.2252 22.4667 11.667 22.4667V20.8667ZM25.0003 22.4667C25.4422 22.4667 25.8003 22.1085 25.8003 21.6667C25.8003 21.2248 25.4422 20.8667 25.0003 20.8667V22.4667ZM11.667 25.8667C11.2252 25.8667 10.867 26.2248 10.867 26.6667C10.867 27.1085 11.2252 27.4667 11.667 27.4667V25.8667ZM20.0003 27.4667C20.4422 27.4667 20.8003 27.1085 20.8003 26.6667C20.8003 26.2248 20.4422 25.8667 20.0003 25.8667V27.4667ZM23.3337 34.2H16.667V35.8H23.3337V34.2ZM7.46699 25V15H5.86699V25H7.46699ZM32.5337 15.0347V25H34.1337V15.0347H32.5337ZM16.667 5.8H23.6732V4.2H16.667V5.8ZM23.6732 5.8C25.2185 5.8 25.7493 5.81639 26.2079 6.02233L26.8633 4.56274C26.0191 4.18361 25.0759 4.2 23.6732 4.2V5.8ZM29.2539 6.70608C28.322 5.65771 27.7076 4.94187 26.8633 4.56274L26.2079 6.02233C26.6665 6.22826 27.0314 6.6141 28.058 7.76907L29.2539 6.70608ZM34.1337 15.0347C34.1337 13.8411 34.1458 13.0399 33.8638 12.2984L32.3683 12.867C32.5216 13.2702 32.5337 13.7221 32.5337 15.0347H34.1337ZM31.0518 11.1371C31.9238 12.1181 32.215 12.4639 32.3683 12.867L33.8638 12.2984C33.5819 11.5569 33.0406 10.9662 32.2476 10.0741L31.0518 11.1371ZM16.667 34.2C14.2874 34.2 12.5831 34.1983 11.2872 34.0241C10.0144 33.8529 9.25596 33.5287 8.69714 32.9698L7.56577 34.1012C8.47142 35.0069 9.62375 35.4148 11.074 35.6098C12.5013 35.8017 14.3326 35.8 16.667 35.8V34.2ZM5.86699 25C5.86699 27.3344 5.86529 29.1657 6.05718 30.593C6.25217 32.0432 6.66012 33.1956 7.56577 34.1012L8.69714 32.9698C8.13833 32.411 7.81405 31.6526 7.64292 30.3798C7.46869 29.0839 7.46699 27.3796 7.46699 25H5.86699ZM23.3337 35.8C25.6681 35.8 27.4993 35.8017 28.9266 35.6098C30.3769 35.4148 31.5292 35.0069 32.4349 34.1012L31.3035 32.9698C30.7447 33.5287 29.9863 33.8529 28.7134 34.0241C27.4175 34.1983 25.7133 34.2 23.3337 34.2V35.8ZM32.5337 25C32.5337 27.3796 32.532 29.0839 32.3577 30.3798C32.1866 31.6526 31.8623 32.411 31.3035 32.9698L32.4349 34.1012C33.3405 33.1956 33.7485 32.0432 33.9435 30.593C34.1354 29.1657 34.1337 27.3344 34.1337 25H32.5337ZM7.46699 15C7.46699 12.6204 7.46869 10.9161 7.64292 9.62024C7.81405 8.34738 8.13833 7.58897 8.69714 7.03015L7.56577 5.89878C6.66012 6.80443 6.25217 7.95676 6.05718 9.40704C5.86529 10.8343 5.86699 12.6656 5.86699 15H7.46699ZM16.667 4.2C14.3326 4.2 12.5013 4.1983 11.074 4.39019C9.62375 4.58518 8.47142 4.99313 7.56577 5.89878L8.69714 7.03015C9.25596 6.47133 10.0144 6.14706 11.2872 5.97592C12.5831 5.8017 14.2874 5.8 16.667 5.8V4.2ZM23.367 5V10H24.967V5H23.367ZM28.3337 14.9667H33.3337V13.3667H28.3337V14.9667ZM23.367 10C23.367 10.7361 23.3631 11.221 23.4464 11.6397L25.0157 11.3276C24.9709 11.1023 24.967 10.8128 24.967 10H23.367ZM28.3337 13.3667C27.5209 13.3667 27.2313 13.3628 27.0061 13.318L26.694 14.8872C27.1127 14.9705 27.5976 14.9667 28.3337 14.9667V13.3667ZM23.4464 11.6397C23.7726 13.2794 25.0543 14.5611 26.694 14.8872L27.0061 13.318C26.0011 13.1181 25.2156 12.3325 25.0157 11.3276L23.4464 11.6397ZM11.667 22.4667H25.0003V20.8667H11.667V22.4667ZM11.667 27.4667H20.0003V25.8667H11.667V27.4667ZM32.2476 10.0741L29.2539 6.70608L28.058 7.76907L31.0518 11.1371L32.2476 10.0741Z"
                    fill="#4F46E5"
                  />
                </svg>
                <div>
                  <h4 className="text-gray-900 text-sm font-normal leading-snug">
                    {fileName}
                  </h4>
                  <h5 className="text-gray-600 text-sm font-semibold font-['Inter'] leading-[18px]">
                    Importing complete 😊
                  </h5>
                </div>
              </div>
              {result && (
                <div>
                  {Object.entries(result).map(([key, value]) => (
                    <div key={key} className="my-4 text-center">
                      <h1 className="text-slate-700 font-semibold">{key}:</h1>
                      {value.length > 0 ? (
                        <ul className="flex flex-row items-center gap-2 justify-center">
                          {value.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No data</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {status === "failed" && (
            <div>
              <div className="w-20 h-20 flex items-center justify-center">
                <img
                  src={failedUploadimg}
                  loading="lazy"
                  alt="Failed upload"
                  className="w-full h-full"
                />
              </div>
              <p className="text-sm text-red-600">{uploadError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Import_clients;

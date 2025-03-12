import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

// import icons
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { ImSpinner8 } from "react-icons/im";

// formik using
import { useFormik } from "formik";
import * as Yup from "yup";
import { addNewData } from "../Rtk/slices/addNewSlice";
import Skeleton from "react-loading-skeleton";
import axios from "axios";

export default function AddacountantForm() {
  const api = import.meta.env.VITE_API_URL;
  // List Departments
  const Departments = [
    "Annual accounts, CT and Director department",
    "Finance department",
    "General and administrative matters",
    "Paye, Pension and CIS department department",
    "Self-employed and partnership department",
    "Vat department",
  ];

  const dispatch = useDispatch();
  const status = useSelector((state) => state.AddNew.status);
  const [alert, setalert] = useState({ msg: "", showmsg: false });
  const [emailValidation, setEmailValidation] = useState({
    loading: false,
    valid: null,
    message: "",
  });

  const routes = ["Accountants", "Add Accountant"];

  // handle email check while typing
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
        valid: status === 200,
        message: "Email already existsd.",
      });
    }
  };

  // Debounced email validation
  const debouncedValidateEmail = useMemo(
    () => _.debounce(checkEmailAvailability, 500),
    [checkEmailAvailability]
  );

  const handleEmailChange = (e) => {
    formik.handleChange(e);
    const email = e.target.value;
    if (email && Yup.string().email().isValidSync(email)) {
      debouncedValidateEmail(email);
    } else {
      setEmailValidation({ loading: false, valid: null, message: "" });
    }
  };
  // handle formik inputs
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      department: "Finance department",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter Accountant name."),
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter a valid Email."),
      phone: Yup.number().required("phone is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        // Dispatch and unwrap the async thunk to get the actual response
        const result = await dispatch(
          addNewData({ path: "accountants", itemData: values })
        ).unwrap();

        console.log("Accountant added successfully:", result);

        // Show success alert
        setalert({
          msg: "Accountant added successfully",
          showmsg: true,
        });

        resetForm(); // Reset form only on success
        return result; // Return result for further use if needed
      } catch (error) {
        
        // Extract meaningful error message
        const errorMsg = error || "Failed to add accountant";
        // Show error alert
        setalert({
          msg: errorMsg,
          showmsg: true,
        });
      } finally {
        // Consistent cleanup of validation state
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
      <div>
        <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]">
          Add new Accountant
        </h1>

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
      {/* display success Adding or failed */}
      {alert.showmsg && (
        <div>
          {status === "loading" ? (
            <div>
              <Skeleton height="2rem" width="100%" className="mb-2" />
            </div>
          ) : (
            <div
              className={`p-4 my-2 text-sm  rounded-xl   flex flex-row items-center justify-between  ${
                status === "success"
                  ? "text-green-700  bg-green-100"
                  : "bg-red-50 text-red-500"
              }`}
              role="alert"
            >
              <span className="font-normal text-sm mr-2">{alert.msg}</span>
              <IoIosCloseCircleOutline
                className="cursor-pointer text-slate-700 text-xl hover:text-slate-400 transition"
                onClick={() =>
                  setalert((prevState) => ({ ...prevState, showmsg: false }))
                }
              />
            </div>
          )}
        </div>
      )}
      <div className="mt-8    overflow-hidden bg-white dark:bg-gray-800 rounded-lg max-w-[700px]   mx-auto border border-solid border-[#919eab33] transition">
        <div className="bg-gray-50  ">
          <h2 className="  text-lg font-medium dark:text-gray-200 p-4">
            Add Accountant
          </h2>
          <hr className="border-t border-t-solid border-[#919eab33]  " />
        </div>

        <div className="md:px-4 px-2 py-4">
          <form
            className="flex flex-col items-start justify-center space-y-6 py-4  w-full "
            onSubmit={formik.handleSubmit}
          >
            <div className="relative w-full">
              <label
                htmlFor="AccountantName"
                className=" customlabel text-gray-900"
              >
                Accountant Name
              </label>
              <input
                id="AccountantName"
                name="name"
                className="peer input block "
                type="text"
                placeholder=" "
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />{" "}
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-600 italic mt-1 text-[12px]">
                  {formik.errors.name}
                </div>
              ) : null}
            </div>
            <div className="relative w-full">
              <label
                htmlFor="Accountantemail"
                className=" customlabel text-gray-900"
              >
                Email
              </label>
              <input
                id="accountantEmail"
                name="email"
                className="peer input block"
                type="email"
                placeholder=" "
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
                  className="w-6 h-6 animate-spin"
                  src="https://www.svgrepo.com/show/474682/loading.svg"
                  alt="Loading icon"
                />
              )}
              {emailValidation.valid === false && (
                <p className="text-red-600 italic mt-1 text-[12px]">
                  {emailValidation.message}
                </p>
              )}
              {emailValidation.valid === true && (
                <p className="text-green-600 italic mt-1 text-[12px]">
                  {emailValidation.message}
                </p>
              )}
            </div>
            <div className="relative w-full">
              <label
                htmlFor="AccountantPhone"
                className=" customlabel text-gray-900"
              >
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                className="peer input "
                type="number"
                min={0}
                placeholder=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
              />

              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-red-600 italic mt-1 text-[12px]">
                  {formik.errors.phone}
                </div>
              ) : null}
            </div>

            <div className="relative w-full">
              <label
                htmlFor="countries"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select Department
              </label>
              <select
                id="departments"
                name="department"
                value={formik.values.department || "Finance Department"}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-slate-700 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
              >
                {Departments.map((department, index) => (
                  <option
                    className="!cursor-pointer"
                    key={index}
                    value={department}
                  >
                    {department}
                  </option>
                ))}
              </select>
              {formik.touched.department && formik.errors.department ? (
                <div className="text-red-600 italic mt-1 text-[12px]">
                  {formik.errors.department}
                </div>
              ) : null}
            </div>
            <div className="flex md:flex-row flex-col  justify-end md:gap-4 gap-2  w-full">
              <button
                type="button"
                className=" bg-[#efeff0] px-4 font-normal rounded-md "
                onClick={() => formik.resetForm()}
              >
                cancel
              </button>
              <button
                className={`blackbutton ${
                  !formik.isValid ||
                  status == "loading" ||
                  emailValidation.valid === false
                    ? "cursor-not-allowed opacity-50  "
                    : " cursor-pointer"
                }`}
                type="submit"
                disabled={
                  !formik.isValid || status == "loading" || formik.isSubmitting
                }
              >
                {status == "loading" ? "Adding" : "Add accountant"}
                {status == "loading" && (
                  <ImSpinner8
                    className="rotate animate-spin transition "
                    size={15}
                  />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

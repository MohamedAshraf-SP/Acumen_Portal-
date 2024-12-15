import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// import icons
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { BsExclamationCircleFill } from "react-icons/bs";
// formik using
import { useFormik } from "formik";
import * as Yup from "yup";
import { addNewData } from "../Rtk/slices/addNewSlice";
import Skeleton from "react-loading-skeleton";

export default function AddClientform() {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.AddNew.status);
  const [alert, setalert] = useState(false);
  const [note, shownote] = useState(true);

  const routes = ["Clients", "Add Client"];
  // handle formik inputs
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      notification: 1,
      department: "Finance department",
      LOEfile: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter client name."),
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter a valid Email."),
      LOEfile: Yup.mixed()
        .required("Please select a file.")
        .test("fileType", "Only PDF files are allowed.", (value) =>
          value ? value.type === "application/pdf" : false
        ),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(addNewData({ path: "clients", itemData: values }));
      setalert(true);
      setTimeout(() => {
        setalert(false);
      }, 4000);

      resetForm();
      setFileName("");
    },
  });

  return (
    <div className="dark:bg-secondary-dark-bg rounded-md h-full">
      <div>
        <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]">
          Create new Account
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
      {alert && (
        <div
          className={`${
            alert ? "fade 0.3s ease-out" : "fade-out 0.3s ease-in 2.7s forwards"
          }`}
        >
          {status == "loading" ? (
            <div>
              {" "}
              <Skeleton height="2rem" width="100%" className="mb-2" />
            </div>
          ) : status == "success" ? (
            <div
              className="bg-green-100 text-green-800 p-4 my-4 rounded-lg animate-pulse"
              role="alert"
            >
              <strong className="font-bold text-sm mr-4">Success!</strong>
              <span className="block text-sm sm:inline max-sm:mt-2">
                Adding new Account done !!
              </span>
            </div>
          ) : (
            <div
              className="p-4 mb-4 text-sm text-red-500 rounded-xl bg-red-50 font-normal"
              role="alert"
            >
              <span className="font-semibold mr-2">Error :</span>Failed Add New
              Account
            </div>
          )}
        </div>
      )}
      <div className="mt-8    overflow-hidden bg-white dark:bg-gray-800 rounded-lg max-w-[700px]   mx-auto border border-solid border-[#919eab33] transition">
        <div className="bg-gray-100  ">
          <h2 className="px-4 text-lg font-semibold dark:text-gray-200 py-4">
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
                htmlFor="clientName"
                className=" customlabel text-gray-500"
              >
                Accountant Name
              </label>
              <input
                id="clientName"
                name="name"
                className="peer input block "
                type="text"
                placeholder=" " // Placeholder space for floating label
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
                htmlFor="clientemail"
                className=" customlabel text-gray-500"
              >
                Email
              </label>
              <input
                id="clientemail"
                name="email"
                className="peer input "
                type="email"
                placeholder=" " // Placeholder space for floating label
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-600 italic mt-1 text-[12px]">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div className="relative w-full">
              <label
                htmlFor="clientemail"
                className=" customlabel text-gray-500"
              >
                Phone
              </label>
              <input
                id="clientemail"
                name="email"
                className="peer input "
                type="email"
                placeholder=" " // Placeholder space for floating label
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-600 italic mt-1 text-[12px]">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div className="relative w-full">
              <label
                htmlFor="clientemail"
                className=" customlabel text-gray-500"
              >
                Department
              </label>
              <input
                id="clientemail"
                name="email"
                className="peer input "
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-600 italic mt-1 text-[12px]">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div className="flex gap-2 items-center">
              <button
                className={`font-thin px-10 max-w-sm mt-4 ${
                  !formik.isValid || status == "loading"
                    ? "bg-gray-800 border-none text-white cursor-not-allowed"
                    : "bg-[#465DFF] text-white  hover:bg-blue-900"
                }`}
                type="submit"
                disabled={
                  !formik.isValid || status == "loading" || formik.isSubmitting
                }
              >
                {status == "loading" && (
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
                )}
                {status == "loading" ? "Loading..." : "Add client"}
              </button>

              <button
                type="button"
                className=" font-thin bg-[#1C252E] text-white px-10 max-w-sm mt-4"
              >
                cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

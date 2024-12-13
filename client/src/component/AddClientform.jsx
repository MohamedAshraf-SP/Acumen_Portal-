import { useState } from "react";
// import icons
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { BsExclamationCircleFill } from "react-icons/bs";
// formik using
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddClientform() {
  const [loading, setLoading] = useState(false);
  const [note, shownote] = useState(true);
  const routes = ["Clients", "Add Client"];
  // handle formik inputs
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      notification: "",
      LOEfile: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter client name."),
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter a valid Email."),
      // uploadedFile: Yup.string().required("Please select .pdf file."),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoading(!loading);
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
      <div className="mt-8 py-4  overflow-hidden bg-white dark:bg-gray-800 rounded-lg max-w-[700px]   mx-auto border border-solid border-[#919eab33] transition">
        <div className="pb-3">
          <h2 className="px-4 text-lg font-semibold dark:text-gray-200 py-2">
            Add Client
          </h2>
          <hr className="border-t border-t-solid border-[#919eab33]  " />
        </div>
        <div className="md:px-4 px-2">
          {note && (
            <span
              className={`text-sm bg-[#EBF9FC] mt-2  md:px-2 px-1 flex lg:flex-row flex-col-reverse md:items-center items-end justify-between space-y-1 transition border border-solid border-[#00b8d925] rounded-lg  w-full ${
                note ? "opacity-100 " : "opacity-0"
              }`}
            >
              <p className="text-[#187AA6] font-medium text-[13px]   md:py-2 flex flex-row md:items-center itams-start md:gap-2 gap-1">
                <BsExclamationCircleFill className=" text-lg text-[#00B8D9] " />
                For every new client, a default company will be auto-created.
              </p>
              <IoIosCloseCircleOutline
                className="text-xl cursor-pointer hover:bg-[#ff5630] hover:text-white overflow-hidden transition rounded-full leading-relaxed text-[#1e88e5]"
                onClick={() => shownote(!note)}
              />
            </span>
          )}
          <form
            className="flex flex-col items-start justify-center space-y-6 py-4  w-full "
            onSubmit={formik.handleSubmit}
          >
            <div className="relative w-full">
              <input
                id="clientName"
                className="peer input "
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
              <label htmlFor="clientName" className=" customlabel">
                Client Name
              </label>
            </div>
            <div className="relative w-full">
              <input
                id="clientemail"
                className="peer input  "
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
              <label htmlFor="clientemail" className=" customlabel">
                Email
              </label>
            </div>
            <div className="w-full mb-5">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center py-9 w-full border border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 "
              >
                <div className="mb-3 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <g id="Upload 02">
                      <path
                        id="icon"
                        d="M16.296 25.3935L19.9997 21.6667L23.7034 25.3935M19.9997 35V21.759M10.7404 27.3611H9.855C6.253 27.3611 3.33301 24.4411 3.33301 20.8391C3.33301 17.2371 6.253 14.3171 9.855 14.3171V14.3171C10.344 14.3171 10.736 13.9195 10.7816 13.4326C11.2243 8.70174 15.1824 5 19.9997 5C25.1134 5 29.2589 9.1714 29.2589 14.3171H30.1444C33.7463 14.3171 36.6663 17.2371 36.6663 20.8391C36.6663 24.4411 33.7463 27.3611 30.1444 27.3611H29.2589"
                        stroke="#4F46E5"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                </div>
                <h2 className="text-center text-gray-400   text-xs font-normal leading-4 mb-1">
                  PDF, smaller than 15MB
                </h2>
                <h4 className="text-center text-gray-900 text-sm font-medium leading-snug">
                  Upload your file here
                </h4>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.LOEfile}
                />
              </label>
              {formik.touched.LOEfile && formik.errors.LOEfile ? (
                <div className="text-red-600 italic mt-1">
                  {formik.errors.LOEfile}
                </div>
              ) : null}
            </div>
            <div className="flex gap-2 items-center">
              <button
                className={`font-thin bg-[#1C252E] text-white px-10 max-w-sm mt-4 ${
                  !formik.isValid || loading
                    ? "bg-gray-800 border-none text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-transparent hover:text-blue-600"
                }`}
                type="submit"
                disabled={!formik.isValid || loading || formik.isSubmitting}
                aria-disabled={!formik.isValid}
              >
                {loading ? "Adding client" : "Add Accountant"}
              </button>
              <button className=" font-thin bg-[#1C252E] text-white px-10 max-w-sm mt-4">
                cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

//  <div className="w-full  ">
//    <select
//      id="countries"
//      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-slate-500 focus:border-slate-900 w-full p-2 outline-none cursor-pointer  "
//    >
//      <option value="">Choose a country</option>
//      <option value="US" className="cursor-pointer">
//        United States
//      </option>
//      <option value="CA">Canada</option>
//      <option value="FR">France</option>
//      <option value="DE">Germany</option>
//    </select>
//  </div>;

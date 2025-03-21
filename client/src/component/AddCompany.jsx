import { useCallback, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LuDot } from "react-icons/lu";
import { useFormik } from "formik";
import * as Yup from "yup";
import Skeleton from "react-loading-skeleton";
import { ImSpinner8 } from "react-icons/im";

import { useDebounce } from "../Hooks/useDebounce";
import { getItem } from "../services/globalService";

export default function AddCompany() {
  const routes = ["Companies", "Add Company"];
  const [searchResult, setSearchResult] = useState([]);
  const [loadign, setLoading] = useState("");

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter company name."),
    }),
    onSubmit: async ({ resetForm }) => {},
  });

  // Debounce search

  const handleSearch = useCallback(
    useDebounce(async (e) => {
      const searchquery = e.target.value;
      setLoading("loading");
      try {
        const response = await getItem(
          "companyHouse/search/companies",
          searchquery
        );
        console.log(response);
        if (response.status === 200) {
          setSearchResult(response.data.items);
          setLoading("success");
        }
      } catch (error) {
        console.log(error);
        setLoading("error");
      }
    }, 500),
    []
  );
  return (
    <div className="dark:bg-secondary-dark-bg rounded-md h-full">
      <header>
        <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]">
          Create New company
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
          {loading === "loading" ? (
            <Skeleton height="2rem" width="100%" className="mb-2" />
          ) : (
            <div
              className={`p-4 mb-4 text-sm rounded-xl font-normal flex items-center justify-between ${
                loading === "success"
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

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg max-w-[700px] mx-auto border border-solid border-[#43464933] shadow-sm">
        <header className="bg-gray-50">
          <h2 className="text-lg font-medium dark:text-gray-200 py-2 px-4 text-slate-700">
            Add company
          </h2>
          <hr className="border-t border-[#919eab33]" />
        </header>

        <form
          className="p-4 flex flex-col gap-4 my-4"
          onSubmit={formik.handleSubmit}
        >
          {/* Name Input */}
          <div className="relative w-full mb-4">
            <label htmlFor="companyName" className=" customlabel text-gray-900">
              company Name
            </label>
            <input
              id="companyName"
              name="name"
              className="peer input block"
              type="text"
              placeholder=""
              onChange={(e) => {
                formik.handleChange(e);
                handleSearch(e);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {/* <label htmlFor="companyName" className="customlabel text-gray-700">
              company Name
            </label> */}
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-600 italic mt-1 text-[12px]">
                {formik.errors.name}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end md:flex-row flex-col md:gap-4 gap-2">
            <button
              type="submit"
              className=" bg-[#efeff0] px-4 font-normal rounded-md "
            >
              cancel
            </button>
            {/* <button
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
              {status == "loading" ? "Adding" : "Add company"}
              {status == "loading" && (
                <ImSpinner8
                  className="rotate animate-spin transition "
                  size={15}
                />
              )}
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
}

import { useCallback, useState } from "react";
import { LuDot } from "react-icons/lu";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDebounce } from "../Hooks/useDebounce";
import { getItem } from "../services/globalService";
import Contentloader from "./Contentloader";
import nosearchresutl from "/images/NodataFound/noSearch.png";
import { CiSearch } from "react-icons/ci";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

// Reusable Breadcrumb Component
const Breadcrumb = ({ routes }) => (
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
        {index > 0 && <LuDot className="text-lg text-gray-400 font-bold" />}
        {route}
      </li>
    ))}
  </ul>
);

// Reusable SearchResults Component
const SearchResults = ({ loading, results, error, onSelect }) => {
  if (loading === "loading") return <Contentloader />;
  if (loading === "failed") return <p className="text-red-500">{error}</p>;
  if (loading === "success" && results?.data?.length === 0)
    return (
      <p className="text-gray-600 p-2 text-xs flex flex-col items-center justify-center gap-1 py-10">
        <span className="w-6 h-6 overflow-hidden">
          <img
            src={nosearchresutl}
            alt="no search found"
            className="w-full h-full"
          />
        </span>
        {results?.message}
      </p>
    );
  return (
    <ul className="max-h-60 overflow-y-auto w-full bg-white border border-gray-200 rounded-lg py-2 shadow-lg">
      {results?.data?.map((item) => (
        <li
          className="text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer px-4 py-2 border-b border-solid last:border-none"
          key={item.companyNumber}
          onClick={() => onSelect(item)}
        >
          {item.companyName}
        </li>
      ))}
    </ul>
  );
};

export default function AddCompany() {
  const routes = ["Companies", "Add Company"];
  const [companiesResults, setCompaniesResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      companyCode: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter company name."),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (values?.companyCode) {
          navigate(`/companies/editcompany?companycode=${values?.companyCode}`);
        }
      } catch (error) {
        console.error("Submission error:", error);
      }
    },
  });

  // Debounced search function
  const handleSearch = useCallback(
    useDebounce(async (e) => {
      const name = e.target.value;
      setSearchQuery(name);
      if (!name.trim()) {
        setCompaniesResults([]); // Clear company results
        setLoading(null);
        formik.setFieldValue("companyCode", ""); // 🔹 Reset company code input
        return;
      }
      setLoading("loading");
      try {
        const response = await getItem("companyHouse/search/companies", name);

        if (response) {
          setCompaniesResults(response);
          setLoading("success");
        }
      } catch (error) {
        setCompaniesResults([]); // 🔹 Clear company results on error
        setSearchQuery(""); // 🔹 Reset search input on error
        console.error("Search error:", error);
        setLoading("failed");
        setError(
          error.response
            ? `Server error: ${error.response.status}`
            : "Network error: Please check your connection."
        );
      }
    }, 200),
    []
  );

  // Handle company selection from search results
  const handleCompanySelect = (company) => {
    formik.setValues({
      name: company.companyName,
      companyCode: company.companyNumber,
    });
    setCompaniesResults([]); // 🔹 Clear search results after selection
    setSearchQuery(""); // 🔹 Clear search query
  };

  return (
    <div className="dark:bg-secondary-dark-bg rounded-md h-full">
      <header>
        <h1 className="text-xl font-semibold leading-[1.5] mt-4 md:mt-2 dark:text-white text-[#1C252E]">
          Create New Company
        </h1>
        <Breadcrumb routes={routes} />
      </header>

      <div className=" bg-white dark:bg-gray-800 rounded-lg max-w-[900px] mx-auto   shadow-sm">
        <form
          className="p-4 flex flex-col gap-4 my-4"
          onSubmit={formik.handleSubmit}
        >
          {/* Company Name Input */}
          <div className="relative w-full ">
            <div className="relative flex items-center justify-center gap-2">
              <span className="absolute left-3 text-gray-500">
                <CiSearch size={20} />
              </span>
              {loading === "loading" && (
                <span className="absolute right-2 text-gray-400 animate-spin">
                  <ImSpinner2 />
                </span>
              )}
              <input
                id="companyName"
                name="name"
                className="text-sm w-full  pl-10 pr-12 py-3 text-gray-600 bg-slate-50 border border-gray-200 rounded-md outline-none  placeholder:text-xs"
                placeholder="search with company name..."
                type="text"
                onChange={(e) => {
                  formik.handleChange(e);
                  handleSearch(e);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
            </div>
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-600  mt-1 text-[12px]">
                {formik.errors.name}
              </p>
            )}

            {/* Display search results */}
            {searchQuery.length > 0 && companiesResults?.data && (
              <div className="absolute top-full left-0 z-50 w-full mt-2 bg-white border border-solid rounded-lg ">
                <SearchResults
                  loading={loading}
                  results={companiesResults}
                  error={error}
                  onSelect={handleCompanySelect}
                />
              </div>
            )}
          </div>

          {/* Company Code Input */}
          {formik.values?.companyCode?.length > 0 && (
            <div className="relative w-full mb-4">
              <label
                htmlFor="companyCode"
                className="mb-1 block text-gray-600 text-sm font-medium  "
              >
                Company Code
              </label>
              <input
                id="companyCode"
                name="companyCode"
                className="peer input block focus:border-[#aeb7c154] cursor-not-allowed"
                type="text"
                readOnly
                value={formik.values.companyCode}
              />
            </div>
          )}
          {/* Submit and Cancel Buttons */}
          <div className="flex justify-end md:flex-row flex-col md:gap-4 gap-2">
            <button
              type="button"
              className="bg-[#efeff0] px-4 font-normal rounded-md"
              onClick={() => formik.resetForm()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="blackbutton"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {formik.isSubmitting ? "saving..." : "save Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

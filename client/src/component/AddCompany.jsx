import { useCallback, useEffect, useState } from "react";
import { LuDot } from "react-icons/lu";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDebounce } from "../Hooks/useDebounce";
import { getAllItems, getItem } from "../services/globalService";
import Contentloader from "./Contentloader";
import nosearchresutl from "/images/NodataFound/noSearch.png";
import { CiSearch } from "react-icons/ci";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { addNewData } from "../Rtk/slices/addNewSlice";
import { useDispatch } from "react-redux";
import ComboBox from "./ComboBox";

const Breadcrumb = ({ routes }) => (
  <ul className="flex items-center space-x-1 text-sm py-2">
    {routes.map((route, index) => (
      <li
        key={index}
        className={`flex items-center ${index === routes.length - 1
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

const SearchResults = ({ loading, results, error, onSelect }) => {
  if (loading === "loading") return <Contentloader />;
  if (loading === "failed") return <p className="text-red-500">{error}</p>;
  if (loading === "success" && results?.data?.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-1 py-8 text-gray-600 text-xs">
        <img src={nosearchresutl} alt="no search" className="w-8 h-8" />
        <span>{results?.message}</span>
      </div>
    );

  return (
    <ul className="max-h-60 overflow-y-auto w-full bg-white border border-gray-200 rounded-lg py-2 shadow-lg">
      {results?.data?.map((item) => (
        <li
          key={item.companyNumber}
          onClick={() => onSelect(item)}
          className="text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer px-4 py-2 border-b last:border-none"
        >
          {item.companyName}
        </li>
      ))}
    </ul>
  );
};

export default function AddCompany() {
  const routes = ["Dashboard", "Add Company"];
  const [companiesResults, setCompaniesResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(null);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const data = await getAllItems("clients");
      setClients(data?.clients || []);
    };
    fetchClients();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      companyCode: "",
      clientID: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter company name."),
      // clientID: Yup.string().required("Please select a client."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log('values',values)
      try {
        const response = await dispatch(
          addNewData({ path: "companies", itemData: values })
        ).unwrap();

        console.log("Created:", response);
        navigate(`/companies/editcompany?companycode=${values.companyCode}`);
      } catch (error) {
        console.error(" Submission error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  /* ─── Debounced Search ─── */
  const handleSearch = useCallback(
    useDebounce(async (e) => {
      const name = e.target.value;
      setSearchQuery(name);
      if (!name.trim()) {
        setCompaniesResults([]);
        setLoading(null);
        formik.setFieldValue("companyCode", "");
        return;
      }

      setLoading("loading");
      try {
        const response = await getItem("companyHouse/search/companies", name);
        setCompaniesResults(response);
        setLoading("success");
      } catch (error) {
        console.error("Search error:", error);
        setCompaniesResults([]);
        setSearchQuery("");
        setLoading("failed");
        setError(
          error.response
            ? `Server error: ${error.response.status}`
            : "Network error: Please check your connection."
        );
      }
    }, 300),
    []
  );

  const handleCompanySelect = (company) => {
    formik.setValues({
      ...formik.values,
      name: company.companyName,
      companyCode: company.companyNumber,
    });
    setCompaniesResults([]);
    setSearchQuery("");
  };

  return (
    <div className="dark:bg-secondary-dark-bg rounded-md h-full">
      <header>
        <h1 className="text-xl font-semibold leading-[1.5] mt-4 md:mt-2 dark:text-white text-[#1C252E]">
          Create New Company
        </h1>
        <Breadcrumb routes={routes} />
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-[900px] mx-auto shadow-sm">
        <form
          className="p-4 flex flex-col gap-5 my-4"
          onSubmit={formik.handleSubmit}
        >
          <div className="relative w-full">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-gray-500">
                <CiSearch size={20} />
              </span>
              {loading === "loading" && (
                <span className="absolute right-3 text-gray-400 animate-spin">
                  <ImSpinner2 />
                </span>
              )}
              <input
                id="companyName"
                name="name"
                className="text-sm w-full pl-10 pr-10 py-3 text-gray-700 bg-slate-50 border border-gray-300 rounded-md outline-none placeholder:text-xs focus:ring-2 focus:ring-gray-300"
                placeholder="Search with company name..."
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
              <p className="text-red-600 mt-1 text-[12px]">
                {formik.errors.name}
              </p>
            )}

            {searchQuery.length > 0 && companiesResults?.data && (
              <div className="absolute top-full left-0 z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg">
                <SearchResults
                  loading={loading}
                  results={companiesResults}
                  error={error}
                  onSelect={handleCompanySelect}
                />
              </div>
            )}
          </div>

          {formik.values.companyCode && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="companyCode"
                  className="mb-1 block text-gray-700 text-sm font-medium"
                >
                  Company Code
                </label>
                <input
                  id="companyCode"
                  name="companyCode"
                  type="text"
                  readOnly
                  className="text-sm w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
                  value={formik.values.companyCode}
                />
              </div>

              <div>
                <label
                  htmlFor="clientId"
                  className="mb-1 block text-gray-700 text-sm font-medium"
                >
                  Client
                </label>
                <ComboBox
                  title="Select client"
                  arr={clients}
                  onSelect={(selected) => {
                    console.log('selected value',selected)
                    formik.setFieldValue("clientID", selected?.id);
                  }}
                />
                {formik.touched.clientId && formik.errors.clientId && (
                  <p className="text-red-600 mt-1 text-[12px]">
                    {formik.errors.clientId}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end md:flex-row flex-col md:gap-4 gap-2 mt-2">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm"
              onClick={() => formik.resetForm()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="blackbutton"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Saving..." : "Save Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

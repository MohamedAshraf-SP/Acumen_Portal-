import TextInput from "../TextInput"; // Text input component
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { getItem } from "../../services/globalService";
import { useParams } from "react-router-dom";
import { GoPlus } from "react-icons/go";

const Rm = () => {
  const status = ["Active", "Proposal to Strike off", "Dissolved"]; // Options for company status
  const [loadingStatus, setLoadingStatus] = useState("idle");
  const [data, setData] = useState({});
  const { companyId } = useParams();

  // Fetch company details with an API request
  const getCompaniesDetails = async () => {
    try {
      setLoadingStatus("loading");
      const response = await getItem("Companies", companyId);
      if (response) {
        setData(response);
        setLoadingStatus("success");
      }
    } catch (error) {
      setLoadingStatus("failed");
      console.log(error);
    }
  };

  useEffect(() => {
    getCompaniesDetails();
  }, [companyId]);

  // Initialize Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      registrationNumber: data?.registrationNumber || "",
      companyName: data?.companyName || "",
      AuthCode: data?.AuthCode || "",
      registrationDate: data?.registrationDate || "",
      CISRegistrationNumber: data?.CISRegistrationNumber || "",
      employerPAYEReference: data?.employerPAYEReference || "",
      AccountsOfficeReference: data?.AccountsOfficeReference || "",
      status: data?.status || "",
      natureOfBusiness: data?.natureOfBusiness || "",
      incorporationDate: data?.incorporationDate || "",
      accountingReferenceDate: data?.accountingReferenceDate || "",
      corporationTax_UTR: data?.corporationTax_UTR || "",
    },

    onSubmit: (values) => {
      console.log("Form Submitted", values);
      // Add logic to handle form submission
    },
  });

  return (
    <div className="my-4 py-4 px-6 rounded-[16px] bg-[#f9f9fa] animate-fade">
      <div className="py-4 flex flex-row items-center justify-between ">
        <h1 className="text-[15px] font-medium">RM</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className=" ">
        <div className="grid grid-cols-1 md:grid-cols-3   gap-4">
          <div class="flex items-center justify-start">
            <input
              type="checkbox"
              class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              id="hs-checked-checkbox"
            />
            <label
              for="hs-checked-checkbox"
              class="text-sm text-gray-500 ms-3 dark:text-neutral-400"
            >
              Annual accounts, CT and Director department
            </label>
          </div>
          <div class="flex items-center justify-start">
            <input
              type="checkbox"
              class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              id="hs-checked-checkbox"
            />
            <label
              for="hs-checked-checkbox"
              class="text-sm text-gray-500 ms-3 dark:text-neutral-400"
            >
              Finance department
            </label>
          </div>{" "}
          <div class="flex items-center justify-start">
            <input
              type="checkbox"
              class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              id="hs-checked-checkbox"
            />
            <label
              for="hs-checked-checkbox"
              class="text-sm text-gray-500 ms-3 dark:text-neutral-400"
            >
              General and administrative matters{" "}
            </label>
          </div>{" "}
          <div class="flex items-center justify-start">
            <input
              type="checkbox"
              class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              id="hs-checked-checkbox"
            />
            <label
              for="hs-checked-checkbox"
              class="text-sm text-gray-500 ms-3 dark:text-neutral-400"
            >
              Paye, Pension and CIS department department
            </label>
          </div>{" "}
          <div class="flex items-center justify-start">
            <input
              type="checkbox"
              class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              id="hs-checked-checkbox"
            />
            <label
              for="hs-checked-checkbox"
              class="text-sm text-gray-500 ms-3 dark:text-neutral-400"
            >
              Self-employed and partnership department
            </label>
          </div>
          <div class="flex items-center justify-start">
            <input
              type="checkbox"
              class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"
              id="hs-checked-checkbox"
            />
            <label
              for="hs-checked-checkbox"
              class="text-sm text-gray-500 ms-3 dark:text-neutral-400"
            >
              Vat department
            </label>
          </div>
        </div>
        <div className="flex md:flex-row flex-col items-center justify-end gap-4 mt-10">
          <button
            type="button"
            className="bg-[#efeff0] px-4 font-normal rounded-md"
            onClick={() => formik.resetForm()}
          >
            Cancel
          </button>
          <button type="submit" className="blackbutton !rounded-xl">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Rm;

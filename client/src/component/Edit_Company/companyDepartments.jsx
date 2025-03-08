import TextInput from "../TextInput"; // Text input component
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { getItem } from "../../services/globalService";
import { useParams } from "react-router-dom";
import { GoPlus } from "react-icons/go";

const companyDepartments = () => {
  const [data, setData] = useState({});
  const { companyId } = useParams();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const departments = [
    {
      _id: 1,
      name: " Annual accounts, CT and Director department",
      value: "",
      satus: "",
    },
    { _id: 2, name: " Finance department", value: "", satus: "" },
    {
      _id: 3,
      name: "General and administrative matters",
      value: "checked",
      satus: "",
    },
    {
      _id: 4,
      name: "Paye, Pension and CIS department department",
      value: "checked",
      satus: "",
    },
    { _id: 5, name: "Vat department", value: "", satus: "" },
    {
      _id: 6,
      name: "Self-employed and partnership department",
      value: "",
      satus: "",
    },
  ];
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
        <h1 className="text-[15px] font-medium">Company departments</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className=" ">
        <div className="grid grid-cols-1 md:grid-cols-3   gap-4">
          {departments?.map((department) => (
            <div class="flex items-center justify-start">
              <input
                type="checkbox"
                checked={department?.value}
                class="shrink-0 mt-0.5 border-gray-200 rounded text-green-600 focus:green-green-500 disabled:opacity-50 disabled:pointer-events-none   checked:bg-green-700 checked:border-green-500   cursor-pointer"
                id="hs-checked-checkbox"
              />
              <label
                for="hs-checked-checkbox"
                class="text-sm text-gray-500 ms-3 dark:text-neutral-400"
              >
                {department?.name}
              </label>
            </div>
          ))}
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

export default companyDepartments;

import TextInput from "../TextInput"; // Text input component
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { getItem } from "../../services/globalService";
import { useParams } from "react-router-dom";
import { GoPlus } from "react-icons/go";

const Directors = () => {
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
      <div className="py-2 flex flex-row items-center justify-between ">
        <h1 className="text-[15px] font-medium">Directors</h1>
        <button type="submit" className="blackbutton !rounded-xl">
          <GoPlus />
          Add Director
        </button>
      </div>
      <form onSubmit={formik.handleSubmit} className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* <div className="form-control block col-span-4  ">
            <label className="label cursor-pointer">
              <span className="label-text text-sm">VAT Registered</span>
              <input type="checkbox" defaultChecked className="checkbox" />
            </label>
          </div> */}
          <TextInput
            label="Director Title"
            id="Director Title"
            type="text"
            placeholder="Enter Director Title"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="registrationNumber"
            value={formik.values.registrationNumber}
            error={formik.errors.registrationNumber}
            touched={formik.touched.registrationNumber}
          />

          <TextInput
            label="Date of Appointment"
            id="DateofAppointment"
            type="date"
            placeholder="Enter Date of Appointment"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="companyName"
            value={formik.values.companyName}
            error={formik.errors.companyName}
            touched={formik.touched.companyName}
          />
          <TextInput
            label="Date of Resignation"
            id="Date of Resignation"
            type="date"
            placeholder="Enter Date of Resignation"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="AuthCode"
            value={formik.values.AuthCode}
            error={formik.errors.AuthCode}
            touched={formik.touched.AuthCode}
          />
          <TextInput
            label="Date Registration for SE"
            id="Date Registration for SE"
            type="date"
            placeholder="Enter Date Registration for SE"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="registrationDate"
            value={formik.values.registrationDate}
            error={formik.errors.registrationDate}
            touched={formik.touched.registrationDate}
          />
          <TextInput
            label="Director Name"
            id="Director Name"
            type="date"
            placeholder="Enter Director Name"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="CISRegistrationNumber"
            value={formik.values.CISRegistrationNumber}
          />
          <TextInput
            label="Director Date of Birth"
            id="Director Date of Birth"
            type="date"
            placeholder="Enter Director Date of Birth"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="employerPAYEReference"
            value={formik.values.employerPAYEReference}
          />
          <TextInput
            label="Director NIN"
            id="Director NIN"
            type="text"
            placeholder="Enter Director NIN"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="AccountsOfficeReference"
            value={formik.values.AccountsOfficeReference}
          />

          <TextInput
            label="Director UTR"
            id="Director UTR"
            type="text"
            placeholder="Enter Director UTR"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="natureOfBusiness"
            value={formik.values.natureOfBusiness}
          />
          <TextInput
            label="Director UTR ID"
            id="Director UTR ID"
            type="text"
            placeholder="Enter Director UTR ID"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="natureOfBusiness"
            value={formik.values.natureOfBusiness}
          />
          <TextInput
            label="Director UTR Password"
            id="Director UTR Password"
            type="password"
            placeholder="Enter Director UTR Password"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="natureOfBusiness"
            value={formik.values.natureOfBusiness}
          />
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

export default Directors;

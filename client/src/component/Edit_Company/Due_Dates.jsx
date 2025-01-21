import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getItem } from "../../services/globalService";
import TextInput from "../TextInput"; // Text input component
import { updateTargetItem } from "../../Rtk/slices/updateItemSlice";
import { setsuccessmsg } from "../../Rtk/slices/settingSlice";

const Due_Dates = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const updateStatus = useSelector((state) => state.updaateItem?.status);
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
      VATRegistered: data?.VATRegistered || "",
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
      <div className="py-2">
        <h1 className="text-[15px] font-medium">Due Dates</h1>
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
            label="Vat Number"
            id="VatNumber"
            type="number"
            placeholder="Enter Vat Number"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="registrationNumber"
            value={formik.values.registrationNumber}
            error={formik.errors.registrationNumber}
            touched={formik.touched.registrationNumber}
          />

          <TextInput
            label="Vat Returns Period"
            id="VatReturnsPeriod"
            type="text"
            placeholder="Vat Returns Period"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="companyName"
            value={formik.values.companyName}
            error={formik.errors.companyName}
            touched={formik.touched.companyName}
          />
          <TextInput
            label="Quarter 1 Due By"
            id="Quarter 1 DueBy"
            type="date"
            placeholder="Enter Quarter 1 Due date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="AuthCode"
            value={formik.values.AuthCode}
            error={formik.errors.AuthCode}
            touched={formik.touched.AuthCode}
          />
          <TextInput
            label="Quarter 2 Due By"
            id="Quarter 2 Due By"
            type="date"
            placeholder="Enter Quarter 2 Due date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="registrationDate"
            value={formik.values.registrationDate}
            error={formik.errors.registrationDate}
            touched={formik.touched.registrationDate}
          />
          <TextInput
            label="Quarter 3 Due By"
            id="Quarter 3 Due By"
            type="date"
            placeholder="Enter Quarter 3 Due date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="CISRegistrationNumber"
            value={formik.values.CISRegistrationNumber}
          />
          <TextInput
            label="Quarter 4 Due By"
            id="Quarter 4 Due By"
            type="date"
            placeholder="Enter Quarter 4 Due date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="employerPAYEReference"
            value={formik.values.employerPAYEReference}
          />
          <TextInput
            label="Accounts Due By"
            id="Accounts Due By"
            type="date"
            placeholder="Enter Accounts Due date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="AccountsOfficeReference"
            value={formik.values.AccountsOfficeReference}
          />

          <TextInput
            label="Confirmation Statement due by"
            id="Confirmation Statement due by"
            type="date"
            placeholder="Enter Confirmation Statement due date"
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

export default Due_Dates;

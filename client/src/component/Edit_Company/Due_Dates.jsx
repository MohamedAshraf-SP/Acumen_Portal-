import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import TextInput from "../TextInput"; // Text input component
import { updateTargetItem } from "../../Rtk/slices/updateItemSlice";
import { setsuccessmsg } from "../../Rtk/slices/settingSlice";
import { fetchCompanyDetails } from "../../Rtk/slices/Fetchcompanydetails";

const Due_Dates = () => {
  const dispatch = useDispatch();
  const updateStatus = useSelector((state) => state.updaateItem?.status);
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const companyCode = searchParams?.get("companycode");
  console.log(companyCode);
  // Fetch company details with an API request
  const { data, loading, error } = useSelector((state) => state.companyDetails);
  useEffect(() => {
    if (companyId || companyCode) {
      dispatch(
        fetchCompanyDetails({ companyId, companyCode, subRoute: "duedates" })
      );
    }
  }, [companyId, companyCode, dispatch]);
  console.log(data);
  // Initialize Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      VATRegistered: data?.VATRegistered || "",
      vatNumber: data?.vatNumber || "",
      vatReturnsPeriod: data?.vatReturnsPeriod || "",
      quarter1DueBy: data?.quarter1DueBy || "",
      quarter2DueBy: data?.quarter2DueBy || "",
      quarter3DueBy: data?.quarter3DueBy || "",
      quarter4DueBy: data?.quarter4DueBy || "",
      confirmationStatementDueBy: data?.confirmationStatementDueBy || "",
      annualVatDueBy: data?.annualVatDueBy || "",
    },

    onSubmit: async (values) => {
      try {
        dispatch(
          updateTargetItem({
            path: "Companies",
            itemId: companyId ? companyId : companyCode,
            updatedItemData: values,
          })
        );
      } catch (error) {}
    },
  });

  return (
    <div className="my-4 py-4 px-6 rounded-[16px] bg-[#f9f9fa] animate-fade">
      <div className="py-2">
        <h1 className="text-[18px] font-medium  ">Due Dates</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="py-4">
        <div className="flex items-center mb-6">
          <input
            id="default-checkbox"
            type="checkbox"
            value=""
            className="cursor-pointer w-5 h-5   appearance-none border border-gray-300 rounded-md mr-2  checked:bg-[#1A7F64] outline-none"
          />
          <label
            for="default-checkbox"
            className=" text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Vat Registered
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TextInput
            label="Vat Number"
            id="VatNumber"
            type="number"
            placeholder="Enter Vat Number"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="vatNumber"
            value={formik.values.vatNumber}
            error={formik.errors.vatNumber}
            touched={formik.touched.vatNumber}
          />

          <TextInput
            label="Vat Returns Period"
            id="quarter1DueBy"
            type="text"
            placeholder="Vat Returns Period"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="quarter1DueBy"
            value={formik.values.quarter1DueBy}
            error={formik.errors.quarter1DueBy}
            touched={formik.touched.quarter1DueBy}
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
            id="quarter2DueBy"
            type="date"
            placeholder="Enter Quarter 2 Due date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="quarter2DueBy"
            value={formik.values.quarter2DueBy}
            error={formik.errors.quarter2DueBy}
            touched={formik.touched.quarter2DueBy}
          />
          <TextInput
            label="Quarter 3 Due By"
            id="quarter3DueBy"
            type="date"
            placeholder="Enter Quarter 3 Due date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="quarter3DueBy"
            value={formik.values.quarter3DueBy}
          />
          <TextInput
            label="Quarter 4 Due By"
            id="quarter4DueBy"
            type="date"
            placeholder="Enter Quarter 4 Due date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="quarter4DueBy"
            value={formik.values.quarter4DueBy}
          />
          <TextInput
            label="Accounts Due By"
            id="annualVatDueBy"
            type="date"
            placeholder="Enter Accounts Due date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="annualVatDueBy"
            value={formik.values.annualVatDueBy}
          />

          <TextInput
            label="Confirmation Statement due by"
            id="confirmationStatementDueBy"
            type="date"
            placeholder="Enter Confirmation Statement due date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="confirmationStatementDueBy"
            value={formik.values.confirmationStatementDueBy}
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
          <button
            disabled={
              formik.isSubmitting ||
              updateStatus === "loading" ||
              !formik.isValid
            }
            type="submit"
            className="blackbutton !rounded-xl"
          >
            {updateStatus === "loading" ? "saving" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Due_Dates;

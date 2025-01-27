import TextInput from "../TextInput"; // Text input component
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { getItem } from "../../services/globalService";
import { useParams } from "react-router-dom";
import { setsuccessmsg } from "../../Rtk/slices/settingSlice";
import { useDispatch, useSelector } from "react-redux";
import { updateTargetItem } from "../../Rtk/slices/updateItemSlice";

const BankDetails = () => {
  const dispatch = useDispatch();
  const updateStatus = useSelector((state) => state.updaateItem?.status);
  const [data, setData] = useState({});
  const { companyId } = useParams();

  // Fetch Bank details with an API request
  const getCompaniesDetails = async () => {
    try {
      const response = await getItem("Companies", companyId);
      if (response) {
        setData(response);
      }
    } catch (error) {
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
      bName: data?.bName || "",
      accountHolder: data?.accountHolder || "",
      accountNumber: data?.accountNumber || "",
      sortCode: data?.sortCode || "",
    },

    onSubmit: (values) => {
      dispatch(
        updateTargetItem({
          path: "Companies",
          itemId: companyId,
          updatedItemData: values,
        })
      );
      if (updateStatus == "success") {
        dispatch(
          setsuccessmsg({
            success: true,
            message: "Bank Details updating success!",
          })
        );
      }
    },
  });
  console.log(updateStatus);
  return (
    <div className="my-4 py-4 px-6 rounded-[16px] bg-[#f9f9fa] animate-fade">
      <div className="py-2 flex flex-row items-center justify-between ">
        <h1 className="text-[15px] font-medium">Bank Details</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2   gap-6">
          <TextInput
            label="Bank Name"
            id="Bank Name"
            type="text"
            placeholder="Enter Bank Name"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="bName"
            value={formik.values.bName}
            error={formik.errors.bName}
            touched={formik.touched.bName}
          />
          <TextInput
            label="Account Holder"
            id="Account Holder"
            type="text"
            placeholder="Enter Account Holder"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="accountHolder"
            value={formik.values.accountHolder}
            error={formik.errors.accountHolder}
            touched={formik.touched.accountHolder}
          />
          <TextInput
            label="Account Number"
            id="Account Number"
            type="number"
            min={0}
            placeholder="Enter Account Number"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="accountNumber"
            value={formik.values.accountNumber}
            error={formik.errors.accountNumber}
            touched={formik.touched.accountNumber}
          />
          <TextInput
            label="Sort Code"
            id="Sort Code"
            type="text"
            placeholder="Enter Sort Code"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="sortCode"
            value={formik.values.sortCode}
            error={formik.errors.sortCode}
            touched={formik.touched.sortCode}
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

export default BankDetails;

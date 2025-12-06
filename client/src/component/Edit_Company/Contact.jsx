import TextInput from "../TextInput"; // Text input component
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { getItem } from "../../services/globalService";
import { useParams } from "react-router-dom";
import { setsuccessmsg } from "../../Rtk/slices/settingSlice";
import { updateTargetItem } from "../../Rtk/slices/updateItemSlice";
import { useDispatch, useSelector } from "react-redux";

const Contact = () => {
  const dispatch = useDispatch();
  const updateStatus = useSelector((state) => state.updaateItem?.status);
  console.log('updateStatus', updateStatus)
  const [data, setData] = useState({});
  const { companyId } = useParams();

  // Fetch company details with an API request
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
      clientName: data?.clientName || "",
      phone: data?.phone || "",
      entryDate: data?.entryDate || "",
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
            message: "Contact updating success!",
          })
        );
      }
    },
  });

  return (
    <div className="my-4 py-4 px-6 rounded-[16px] bg-[#f9f9fa] animate-fade">
      <div className="py-2 flex flex-row items-center justify-between ">
        <h1 className="text-[15px] font-medium">contact</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2   gap-6">
          <TextInput
            label="Contact Name"
            id="Contact Name"
            type="text"
            placeholder="Enter Contact Name"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="clientName"
            value={formik.values.clientName}
            error={formik.errors.clientName}
            touched={formik.touched.clientName}
          />
          <TextInput
            label="Phone"
            id="Phone"
            type="number"
            min={0}
            placeholder="Enter Phone"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="phone"
            value={formik.values.phone}
            error={formik.errors.phone}
            touched={formik.touched.phone}
          />
          <TextInput
            label="Entry Date"
            id="Entry Date"
            type="date"
            placeholder="Enter Entry Date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="entryDate"
            value={
              formik?.values?.entryDate ? (
                new Date(formik?.values?.entryDate).toISOString().split("T")[0]
              ) : (
                <span>N/A</span>
              )
            }
            error={formik.errors.entryDate}
            touched={formik.touched.entryDate}
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

export default Contact;

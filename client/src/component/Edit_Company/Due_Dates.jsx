import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import TextInput from "../TextInput";
import ComboBox from "../ComboBox";
import { apiCall } from "../../services/globalService";
import { fetchCompanyDetails } from "../../Rtk/slices/Fetchcompanydetails";
import { setsuccessmsg } from "../../Rtk/slices/settingSlice";

// Helper function to format ISO date -> YYYY-MM-DD
const formatDate = (dateString) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

// Helper to convert back to ISO before sending
const toISODate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString();
};

const Due_Dates = ({ vatRegitered, dueDates }) => {
  const updateStatus = useSelector((state) => state.updaateItem?.status);
  const dispatch = useDispatch();
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const companyCode = searchParams?.get("companycode");

  const vatPeriodOptions = [
    { name: "Annually", _id: 1 },
    { name: "Quarterly", _id: 2 },
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      VATRegistered: vatRegitered || false,
      vatNumber: dueDates?.vatNumber || "",
      vatReturnsPeriod: dueDates?.vatReturnsPeriod || "",
      quarter1DueBy: formatDate(dueDates?.quarter1DueBy),
      quarter2DueBy: formatDate(dueDates?.quarter2DueBy),
      quarter3DueBy: formatDate(dueDates?.quarter3DueBy),
      quarter4DueBy: formatDate(dueDates?.quarter4DueBy),
      confirmationStatementDueBy: formatDate(dueDates?.confirmationStatementDueBy),
      annualVatDueBy: formatDate(dueDates?.annualVatDueBy),
    },

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formattedValues = {
          ...values,
          quarter1DueBy: toISODate(values.quarter1DueBy),
          quarter2DueBy: toISODate(values.quarter2DueBy),
          quarter3DueBy: toISODate(values.quarter3DueBy),
          quarter4DueBy: toISODate(values.quarter4DueBy),
          confirmationStatementDueBy: toISODate(values.confirmationStatementDueBy),
          annualVatDueBy: toISODate(values.annualVatDueBy),
        };

        await apiCall(
          "PUT",
          `Companies/${companyId || companyCode}/duedates`,
          null,
          null,
          formattedValues
        );
        dispatch(fetchCompanyDetails({ companyId }));
        dispatch(
          setsuccessmsg({
            success: true,
            message: "new due dates adding success!",
          })
        );

      } catch (error) {
        console.error(" Error updating due dates:", error);
        alert("Error updating due dates");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="my-4 py-4 px-6 rounded-[16px] bg-[#f9f9fa] animate-fade">
      <div className="py-2">
        <h1 className="text-[18px] font-medium">Due Dates</h1>
      </div>

      <form onSubmit={formik.handleSubmit} className="py-4">
        {/* VAT Registered Checkbox */}
        <div className="flex items-center mb-6">
          <input
            id="vatRegistered"
            type="checkbox"
            name="VATRegistered"
            checked={formik.values.VATRegistered}
            onChange={formik.handleChange}
            className="cursor-pointer w-5 h-5 appearance-none border border-gray-300 rounded-md mr-2 checked:bg-[#1A7F64] outline-none"
          />
          <label htmlFor="vatRegistered" className="text-sm font-medium text-gray-600">
            VAT Registered
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Show all fields if VATRegistered is true */}
          {formik.values.VATRegistered && (
            <>
              <TextInput
                label="VAT Number"
                id="vatNumber"
                type="number"
                placeholder="Enter VAT Number"
                className="customInput"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="vatNumber"
                value={formik.values.vatNumber}
                error={formik.errors.vatNumber}
                touched={formik.touched.vatNumber}
              />

              {/* ComboBox for VAT Returns Period */}
              <div className="flex flex-col">
                <label className="text-[13px] font-medium text-black/40 leading-relaxed mb-1">
                  VAT Returns Period
                </label>
                <ComboBox
                  arr={vatPeriodOptions}
                  hideSearch={true}
                  title="Select VAT Returns Period"
                  loading={false}
                  searchQuery={formik.values.vatReturnsPeriod}
                  onSelect={(selectedValue) =>
                    formik.setFieldValue("vatReturnsPeriod", selectedValue)
                  }
                  className="bg-white !rounded-lg h-full px-3 py-2 w-full"
                />
              </div>

              {[1, 2, 3, 4].map((q) => (
                <TextInput
                  key={q}
                  label={`Quarter ${q} Due By`}
                  id={`quarter${q}DueBy`}
                  type="date"
                  placeholder={`Enter Quarter ${q} Due date`}
                  className="customInput"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={`quarter${q}DueBy`}
                  value={formik.values[`quarter${q}DueBy`]}
                />
              ))}
            </>
          )}

          {/* Always visible fields */}
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
            error={formik.errors.annualVatDueBy}
            touched={formik.touched.annualVatDueBy}
          />

          <TextInput
            label="Confirmation Statement Due By"
            id="confirmationStatementDueBy"
            type="date"
            placeholder="Enter Confirmation Statement due date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="confirmationStatementDueBy"
            value={formik.values.confirmationStatementDueBy}
            error={formik.errors.confirmationStatementDueBy}
            touched={formik.touched.confirmationStatementDueBy}
          />
        </div>

        {/* Buttons */}
        <div className="flex md:flex-row flex-col items-center justify-end gap-4 mt-10">
          <button
            type="button"
            className="bg-[#efeff0] px-4 font-normal rounded-md"
            onClick={() => formik.resetForm()}
          >
            Cancel
          </button>
          <button
            disabled={formik.isSubmitting || !formik.isValid}
            type="submit"
            className="blackbutton !rounded-xl"
          >
            {formik.isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Due_Dates;

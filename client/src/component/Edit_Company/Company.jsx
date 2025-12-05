import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "../TextInput"; // Text input component
import { updateTargetItem } from "../../Rtk/slices/updateItemSlice";
import { setsuccessmsg } from "../../Rtk/slices/settingSlice";
import { fetchCompanyDetails } from "../../Rtk/slices/Fetchcompanydetails";
import Contentloader from "../Contentloader";
import { useAuth } from "../../Contexts/AuthContext";
const Company = () => {
  const statusOptions = ["Active", "Proposal to Strike off", "Dissolved"];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const companyCode = searchParams?.get("companycode");
  const updateStatus = useSelector((state) => state.updaateItem?.status);
  // Get company data from Redux
  const { data, loading, error } = useSelector((state) => state.companyDetails);
  useEffect(() => {
    if (companyId || companyCode) {
      dispatch(fetchCompanyDetails({ companyId, companyCode, subRoute: "" }));
    }
  }, [companyId, companyCode, dispatch]);
   // Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      registrationNumber: data?.registrationNumber || "",
      companyName: data?.companyName || "",
      AuthCode: data?.AuthCode || "",
      registrationDate: data?.registrationDate || "",
      incorporationDate: data?.incorporationDate || "",
      accountingReferenceDate: data?.accountingReferenceDate || "",
      CISRegistrationNumber: data?.CISRegistrationNumber || "",
      employerPAYEReference: data?.employerPAYEReference || "",
      AccountsOfficeReference: data?.AccountsOfficeReference || "",
      status: data?.companyStatus || "",
      natureOfBusiness: data?.natureOfBusiness || "",
      corporationTax_UTR: data?.corporationTax_UTR || "",
    },
    validationSchema: Yup.object({
      registrationNumber: Yup.string().required(
        "Registration Number is required"
      ),
      companyName: Yup.string().required("Company Name is required"),
      AuthCode: Yup.string().required("Authentication Code is required"),
      registrationDate: Yup.date().required("Registration Date is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: (values) => {
      dispatch(
        updateTargetItem({
          path: "Companies",
          itemId: companyId && companyId,
          updatedItemData: values,
        })
      );
      if (updateStatus == "success") {
        dispatch(
          setsuccessmsg({
            success: true,
            message: "company updating success!",
          })
        );
      }
    },
  });

  // handle cancel Button
  const handleCancelBtn = () => {
    formik.resetForm();
    navigate(`/${user?.role}/dashboard`);
  };
  return (
    <div className="my-4 py-4 px-6 rounded-[16px] bg-[#f9f9fa] animate-fade relative">
      {/* create loading while saveing process complete */}
      {updateStatus == "loading" ||
        (loading === "loading" && <Contentloader />)}
      <div className="py-2">
        <h1 className="text-[15px] font-medium">Company Details</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TextInput
            label="Registration Number"
            id="registrationNumber"
            type="text"
            min={0}
            placeholder="Registration Number"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="registrationNumber"
            value={formik.values.registrationNumber}
            error={formik.errors.registrationNumber}
            touched={formik.touched.registrationNumber}
          />

          <TextInput
            label="Company Name"
            id="companyName"
            type="text"
            placeholder="Company Name"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="companyName"
            value={formik.values.companyName}
            error={formik.errors.companyName}
            touched={formik.touched.companyName}
          />
          <TextInput
            label="Authentication Code"
            id="AuthCode"
            type="text"
            placeholder="Authentication Code"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="AuthCode"
            value={formik.values.AuthCode}
            error={formik.errors.AuthCode}
            touched={formik.touched.AuthCode}
          />
          <TextInput
            label="Registration Date"
            id="registrationDate"
            type="date"
            placeholder="Registration Date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="registrationDate"
            value={
              formik?.values?.registrationDate ? (
                new Date(formik?.values?.registrationDate)
                  .toISOString()
                  .split("T")[0]
              ) : (
                <span>N/A</span>
              )
            }
            error={formik.errors.registrationDate}
            touched={formik.touched.registrationDate}
          />
          <TextInput
            label="CIS Registration Number"
            id="CISRegistrationNumber"
            type="text"
            placeholder="CIS Registration Number"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="CISRegistrationNumber"
            value={formik.values.CISRegistrationNumber}
          />
          <TextInput
            label="Employer PAYE Reference"
            id="employerPAYEReference"
            type="text"
            placeholder="Employer PAYE Reference"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="employerPAYEReference"
            value={formik.values.employerPAYEReference}
          />
          <TextInput
            label="Accounts Office Reference"
            id="AccountsOfficeReference"
            type="text"
            placeholder="Accounts Office Reference"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="AccountsOfficeReference"
            value={formik.values.AccountsOfficeReference}
          />
          <div className="flex flex-col items-start gap-1">
            <label
              className="text-[13px] font-medium text-black/40 leading-relaxed"
              htmlFor="status"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-none   focus:border-slate-700 block w-full p-2.5"
            >
              {statusOptions?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formik.touched.status && formik.errors.status && (
              <div className="text-red-500 text-sm">{formik.errors.status}</div>
            )}
          </div>
          <TextInput
            label="Nature of Business"
            id="natureOfBusiness"
            type="text"
            placeholder="Nature of Business"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="natureOfBusiness"
            value={formik.values.natureOfBusiness}
          />
          <TextInput
            label="Incorporation Date"
            id="incorporationDate"
            type="date"
            placeholder="Incorporation Date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="incorporationDate"
            value={
              formik?.values?.incorporationDate ? (
                new Date(formik?.values?.incorporationDate)
                  .toISOString()
                  .split("T")[0]
              ) : (
                <span>N/A</span>
              )
            }
            error={formik.errors.incorporationDate}
            touched={formik.touched.incorporationDate}
          />
          <TextInput
            label="Accounting Reference Date"
            id="Accounting Reference Date"
            type="date"
            placeholder="Accounting Reference Date"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="accountingReferenceDate"
            value={
              formik?.values?.accountingReferenceDate ? (
                new Date(formik?.values?.accountingReferenceDate)
                  .toISOString()
                  .split("T")[0]
              ) : (
                <span>N/A</span>
              )
            }
            error={formik.errors.accountingReferenceDate}
            touched={formik.touched.accountingReferenceDate}
          />
          <TextInput
            label="Corporation Tax (UTR)"
            id="corporationTax_UTR"
            type="text"
            placeholder="Corporation Tax (UTR)"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="corporationTax_UTR"
            value={formik.values.corporationTax_UTR}
          />
        </div>
        <div className="flex md:flex-row flex-col items-center justify-end gap-4 mt-10 w-full ">
          <button
            type="button"
            className={`bg-[#efeff0] px-4 font-normal rounded-md  
               `}
            onClick={() => handleCancelBtn()}
          >
            Cancel
          </button>
          <button
            type="submit"
            // disabled={!formik.isValid}
            className={`blackbutton !rounded-xl ${
              updateStatus == "loading" || !formik.isValid
                ? "opacity-[.6] cursor-not-allowed"
                : "opacity-100"
            }`}
          >
            {updateStatus == "loading" ? "saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Company;

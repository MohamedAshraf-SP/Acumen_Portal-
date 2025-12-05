import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getItem } from "../../services/globalService";
import TextInput from "../TextInput"; // Text input component
import { updateTargetItem } from "../../Rtk/slices/updateItemSlice";
import { setsuccessmsg } from "../../Rtk/slices/settingSlice";

const Address = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const updateStatus = useSelector((state) => state.updaateItem?.status);
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const companyCode = searchParams?.get("companycode");
  // Fetch company details with an API request
  const getCompaniesDetails = async () => {
    try {
      const response = await getItem("Companies", companyId);
       if (response) {
        setData(response);
         dispatch(
           setsuccessmsg({
             success: true,
             message: "new address adding success!",
           })
         );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCompaniesDetails();
  }, []);

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      businessAddress: data?.businessAddress || "",
      registeredOfficeAddress: data?.registeredOfficeAddress || "",
      telephone: data?.telephone || "",
      email: data?.email || "",
      website: data?.website || "",
    },
    validationSchema: Yup.object({
      telephone: Yup.number().typeError("telephone must be a number").min(0),
      email: Yup.string().email("Invalid email format"),
    }),

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
            message: "Address updating success!",
          })
        );
      }
    },
  });
  // handle cancel Button
  const handleCancelBtn = () => {
    formik.resetForm();
    navigate("/");
  };
  return (
    <div className="my-4 py-4 px-6 rounded-[16px] bg-[#f9f9fa] animate-fade relative">
      {/* create loading while saveing process complete */}
      {updateStatus == "loading" && (
        <div className="bg-slate-950/60 fixed w-full h-full inset-0 flex items-center justify-center z-50 fade animate-fade">
          <div role="status" className="text-center ">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-slate-900 animate-spin dark:text-gray-600 fill-white "
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="block text-white text-center mt-2 text-md">
              Update...
            </span>
          </div>
        </div>
      )}
      <div className="py-2">
        <h1 className="text-[15px] font-medium">Company Details</h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TextInput
            label="Business Address"
            id="businessAddress"
            type="text"
            min={0}
            placeholder="enter Business Address"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="businessAddress"
            value={formik.values.businessAddress}
            error={formik.errors.businessAddress}
            touched={formik.touched.businessAddress}
          />

          <TextInput
            label="Registered Office Address"
            id="RegisteredOfficeAddress"
            type="text"
            placeholder="Enter Registered Office Address"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="registeredOfficeAddress"
            value={formik.values.registeredOfficeAddress}
            error={formik.errors.registeredOfficeAddress}
            touched={formik.touched.registeredOfficeAddress}
          />
          <TextInput
            label="Telephone"
            id="Telephone"
            type="number"
            placeholder="Enter Telephone"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="telephone"
            value={formik.values.telephone}
            error={formik.errors.telephone}
            touched={formik.touched.telephone}
          />
          <TextInput
            label="Email"
            id="Email"
            type="email"
            placeholder="enter your Email"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="email"
            value={formik?.values?.email}
            error={formik.errors.email}
            touched={formik.touched.email}
          />
          <TextInput
            label="Website: Example(https://www.abc.com)"
            id="website"
            type="text"
            placeholder="enter Your Website"
            className="customInput"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="website"
            value={formik?.values?.website}
            error={formik.errors.website}
            touched={formik.touched.website}
          />
        </div>
        <div className="flex md:flex-row flex-col-reverse items-center justify-end gap-4 mt-10">
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
            disabled={!formik.isValid}
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

export default Address;

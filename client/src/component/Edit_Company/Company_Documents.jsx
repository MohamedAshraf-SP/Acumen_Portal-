import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useSearchParams } from "react-router-dom";
// import icons
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { BsFillCloudUploadFill } from "react-icons/bs";
import CompanyDocTable from "../CompanyDocTable";
import { useDispatch } from "react-redux";
import { fetchCompanyDetails } from "../../Rtk/slices/Fetchcompanydetails";
import { setsuccessmsg } from "../../Rtk/slices/settingSlice";
const api = import.meta.env.VITE_API_URL;

const Company_Documents = () => {
  // have uploaded document name
  const [documentName, setDocumentName] = useState("");
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const companyCode = searchParams?.get("companycode");
  const [Uploadstatus, setUploadStatus] = useState("idle");
  // get id from params
  const { companyId } = useParams();
  // add Required_Document
  const Required_Document = [
    "Copy of ID",
    "64-8",
    "Proof of address ",
    "Acumen form ",
    "Engagement letter",
    "Standing order ",
  ];
  // get uploaded document
  const hadleuploadedDocument = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentName(file.name);
      formik.setFieldValue("file", file);
    } else {
      setDocumentName("");
    }
  };
  // implement formik
  const formik = useFormik({
    initialValues: {
      title: "",
      file: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title Can't be empty"),
      file: Yup.mixed()
        .required("File is required")
        .test(
          "fileSize",
          "File size should not exceed 15MB.",
          (value) => value && value.size <= 10000000
        )
        .test(
          "fileFormat",
          "Unsupported file format. Only .pdf, .csv, .zip, and .rar are allowed.",
          (value) =>
            value &&
            [
              "application/pdf",
              "text/csv",
              "application/zip",
              "application/x-rar-compressed",
            ].includes(value.type)
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("file", values.file);
      // handle post request
      try {
        setUploadStatus("loading");
        const response = await axios.post(
          `${api}/Companies/${companyId}/documents`,
          formData
        );
        if (response.status == 201) {
          
          setUploadStatus("success");
         dispatch(fetchCompanyDetails({ companyId }));
          dispatch(
                   setsuccessmsg({
                     success: true,
                     message: "new document adding success!",
                   })
                 );
        
        }
      } catch (error) {
        console.log(error);
        setUploadStatus("failed");
      } finally {
        setDocumentName("");
        resetForm();
        const timeOut = setTimeout(() => {
          setUploadStatus("idle");
        }, 1800);
        // clear timeOut afrer 1600 second
        return () => clearTimeout(timeOut);
      }
    },
  });

  return (
    <div className="my-4 py-4 px-6 rounded-[16px] bg-[#f9f9fa] animate-fade">
      <div className="py-2 flex flex-row items-center justify-between ">
        <h1 className="text-[15px] font-medium">Documents</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2   gap-2">
        <div className="my-4">
          <h1 className="text-[16px] font-medium text-slate-600">
            Required Document Checklist
          </h1>
          <ul className="list-disc    text-slate-500 mt-2">
            {Required_Document.map((item, index) => (
              <li className="flex flex-row items-center gap-2 my-3" key={index}>
                <IoCheckmarkDoneOutline className="text-sky-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={formik.handleSubmit}>
          {/* display error msg if happen  */}
          <div className="my-4 rounded-lg overflow-hidden">
            {Uploadstatus == "failed" ? (
              <p className="  text-red-700 text-md  text-center font-normal animate-pulse  p-4">
                ⚠️ cant Upload document , please try again
              </p>
            ) : Uploadstatus == "success" ? (
              <p className="  text-slate-600 text-center text-md font-medium capitalize   bg-[#E1EFFE] p-4 ">
                document Uploading successfully 😊
              </p>
            ) : null}
          </div>

          <div className="flex flex-col items-start gap-1">
            <label
              className="text-[13px] font-medium text-black/40 leading-relaxed"
              htmlFor="status"
            >
              Title{" "}
              <span className="text-xs text-gray-600">( Select Document )</span>
            </label>
            <select
              id="file"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-300 focus:border-slate-700 block w-full p-2.5 outline-none"
            >
              <option value="" disabled>
                Select Document
              </option>
              {Required_Document?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-600 italic mt-1 text-[12px] block">
                {formik.errors.title}
              </div>
            )}
          </div>
          <div className="w-full py-9 bg-[linear-gradient(135deg,_#f5f7fa_0%,_#c3cfe2_100%)] rounded-2xl border border-gray-300 border-dashed h-[260px] mt-6">
            <div className="grid gap-2">
              <svg
                className="w-12 h-12 mb-2 mx-auto text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <div className="grid gap-4">
                {documentName.length > 0 ? (
                  <div className="text-center">{documentName}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-center text-gray-500 text-sm ">
                      Only .pdf, .csv, .zip, .rar files are acceptable.
                      <br /> File size shoudn't be more than 10MB.
                    </span>
                    <span className="text-center text-gray-400 text-xs font-light leading-4">
                      OR
                    </span>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center gap-1">
                  <label>
                    <input
                      type="file"
                      name="file"
                      id="fileInput"
                      accept=".pdf,.csv,.zip,.rar"
                      hidden
                      onChange={hadleuploadedDocument}
                      onBlur={formik.handleBlur}
                    />
                    <div className="flex  h-9 px-4 flex-col bg-slate-700 rounded-lg shadow-lg hover:opacity-[.8] text-white text-xs font-normal leading-4 items-center justify-center cursor-pointer focus:outline-none">
                      {documentName ? "Upload another File" : "Upload File"}
                    </div>
                  </label>
                  {formik.errors.file && formik.touched.file && (
                    <div className="text-red-600 italic mt-1 text-[12px] block">
                      {formik.errors.file}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex md:flex-row flex-col-reverse items-center justify-end gap-4 mt-10">
            <button
              type="submit"
              disabled={!formik.isValid || Uploadstatus == "loading"}
              className={`blackbutton !rounded-xl ${
                Uploadstatus == "loading" ||
                (!formik.isValid && "cursor-not-allowed")
              } `}
            >
              <BsFillCloudUploadFill size={16} />
              {Uploadstatus == "loading" ? "Uploading ..." : "Upload document"}
            </button>
          </div>
        </form>
      </div>

      {/* dispaly company Uploaded Documents */}
      <CompanyDocTable Uploadstatus={Uploadstatus} />
    </div>
  );
};

export default Company_Documents;

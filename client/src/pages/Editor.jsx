import React, { useEffect, useState } from "react";
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";
import { LuDot } from "react-icons/lu";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { getItem, updateItem } from "../services/globalService";
import Skeleton from "react-loading-skeleton";
import { updateTargetItem } from "../Rtk/slices/updateItemSlice";
import { useDispatch } from "react-redux";

export default function Editor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);
  const [content, setcontent] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const routes = ["Notification", "Edit Notifications"];
  //  get id from params
  let { id } = useParams();
  // get elementById
  const getElementById = async () => {
    try {
      const response = await getItem("emailtemplates", id);
      if (response.success === true) {
        setcontent(response.data);
        setloading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getElementById();
  }, [id]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      subject: content?.name || "",
      content: content?.content || "",
    },
    validationSchema: Yup.object({
      subject: Yup.string().required("Subject can't be empty"),
      content: Yup.string().required("Content can't be empty"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(
          updateTargetItem({
            path: "emailtemplates",
            itemId: content._id, // Ensure TargetItem is defined
            updatedItemData: values,
          })
        );
        console.log(values);
      } catch (error) {
        console.log(error);
      }
      navigate("/notifications");
    },
  });

  return (
    <div className="p-4 md:p-10 bg-white rounded-3xl  ">
      {/* Header Section */}
      <div className="flex lg:flex-row flex-col items-center justify-between ">
        <div>
          <h1 className="text-xl font-semibold leading-[1.5] dark:text-white text-[#1C252E]">
            Notification Template{" "}
            <span className="bg-red-500 capitalize px-4 text-sm font-thin py-1 text-white rounded-full">
              {content?.documentType}
            </span>
          </h1>

          {/* Breadcrumb Navigation */}
          <ul className="flex flex-row items-center space-x-1 text-sm py-2">
            {routes.map((route, index) => (
              <li
                key={index}
                className={`flex items-center ${
                  index === routes.length - 1
                    ? "text-gray-400"
                    : "text-slate-900 dark:text-gray-200 hover:underline"
                }`}
              >
                {index > 0 && (
                  <LuDot className="text-lg text-gray-400 font-bold mx-1" />
                )}
                {route}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form Section */}
      <div className="my-6">
        {loading ? (
          <div>
            <Skeleton width="100%" height="20rem" />
            <Skeleton width="75%" className="mb-2" />
            <Skeleton width="50%" className="mb-2" />
            <Skeleton height="2rem" className="mb-2" />
          </div>
        ) : (
          <form
            className="flex flex-col space-y-6"
            onSubmit={formik.handleSubmit}
          >
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 after:content-['*'] after:text-red-500 after:ml-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="title"
                name="subject"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subject}
                aria-label="Notification Title"
                placeholder="Enter notification title"
                className="border border-gray-300 rounded-md p-2 w-full focus:ring-1 focus:ring-slate-800 focus:outline-none bg-[#F6F7F8]"
              />
              {formik.touched.subject && formik.errors.subject ? (
                <div className="text-red-600 italic mt-1 text-[12px]">
                  {formik.errors.subject}
                </div>
              ) : null}
            </div>

            {/* Content Editor */}
            <div className="w-full">
              <label
                htmlFor="content"
                className="block relative  text-sm font-medium text-gray-700 dark:text-gray-300 mb-2   after:content-['*'] after:text-red-500 after:ml-1"
              >
                Content
                {/* <span className="text-red-500"> *</span> */}
              </label>

              <RichTextEditorComponent
                id="content"
                aria-label="Notification Content"
                className="h-fit overflow-hidden border border-dotted border-gray-300 rounded-md bg-[#F6F7F8]"
                name="content"
                value={formik.values.content}
                change={(e) => formik.setFieldValue("content", e.value)}
              >
                <Inject
                  services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]}
                />
              </RichTextEditorComponent>

              {formik.touched.content && formik.errors.content ? (
                <div className="text-red-600 italic mt-1 text-[12px]">
                  {formik.errors.content}
                </div>
              ) : null}
            </div>
            <div className="flex gap-2 items-center">
              <button
                className={`font-thin px-10 max-w-sm mt-4 ${
                  !formik.isValid || status == "loading"
                    ? "bg-gray-800 border-none text-white cursor-not-allowed"
                    : "bg-[#465DFF] text-white  hover:bg-blue-900"
                }`}
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                {status == "loading" && (
                  <svg
                    aria-hidden="true"
                    role="status"
                    className="inline w-4 h-4 me-3 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                {status == "loading" ? "Loading..." : "Update"}
              </button>

              <button
                type="button"
                className=" font-thin bg-[#1C252E] text-white px-10 max-w-sm mt-4"
                onClick={() => formik.resetForm()}
              >
                cancel
              </button>
            </div>
          </form>
        )}
        <div className="flex flex-col mt-8 space-y-3 text-[#969695] bg-slate-700 p-6 rounded-md w-[800px] text-sm shadow-lg">
          <h1 className="text-md font-semibold text-white ">Placeholders</h1>
          <ul className="space-y-2 list-disc list-inside ">
            <li>
              <strong>#NAME#:</strong> Client name can display with this
              placeholder.
            </li>
            <li>
              <strong>#LOGINLINK#:</strong> Login link can display with this
              placeholder.
            </li>
            <li>
              <strong>#COMPANYNAME#:</strong> Company name can display with this
              placeholder.
            </li>
            <li>
              <strong>#ACCOUNTANTNAME#:</strong> Accountant Name / RM Manager
              name can display with this placeholder.
            </li>
            <li>
              <strong>#SIGNATURE#:</strong> Email Signature can display with
              this placeholder.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

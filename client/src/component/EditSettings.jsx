import { useFormik } from "formik";
import * as Yup from "yup";
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from "@syncfusion/ej2-react-richtexteditor";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { updateTargetItem } from "../Rtk/slices/updateItemSlice";
import { setsuccessmsg } from "../Rtk/slices/settingSlice";

export default function EditSettings({ Formid, onClose }) {
  const api = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.updaateItem);

  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const cardRef = useRef();

  // Fetch Target Item Data
  const getTargetItemData = async () => {
    try {
      const response = await axios.get(`${api}/helpers/consts/${Formid}`);
      if (response.status === 200) {
        setSettingsData(response.data);
      }
    } catch (error) {
      console.error("Failed to load target item data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Formid) getTargetItemData();
  }, [Formid]);

  // Close the form on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Formik Configuration
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: settingsData?.name || "",
      value: settingsData?.value || "",
    },
    validationSchema: Yup.object({
      name: Yup.string(),
      value: Yup.string().required("Content is required."),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await dispatch(
          updateTargetItem({
            path: "helpers/consts",
            itemId: settingsData._id,
            updatedItemData: values,
          })
        ).unwrap();

        dispatch(
          setsuccessmsg({
            success: true,
            message: "Signature updated successfully!",
          })
        );

        onClose();
      } catch (error) {
        console.error("Failed to update settings:", error);
      } finally {
        resetForm();
      }
    },
  });
  if (status == "success") window.location.reload();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={cardRef}
        className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg"
      >
        <div className="flex flex-row items-start justify-start gap-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Edit Settings Form
          </h4>

          <span className="bg-[#ce424e] text-white px-4 py-1 rounded-lg text-sm">
            {formik?.values?.name || "Loading..."}
          </span>
        </div>
        {loading ? (
          <Skeleton count={5} height={20} className="mb-4" />
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="value"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Content
              </label>
              <RichTextEditorComponent
                id="value"
                value={formik.values.value}
                change={(e) => formik.setFieldValue("value", e.value)}
                className="mt-1 border border-gray-300 rounded-md"
              >
                <Inject
                  services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]}
                />
              </RichTextEditorComponent>
              {formik.touched.value && formik.errors.value && (
                <p className="mt-2 text-sm text-red-600">
                  {formik.errors.value}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formik.isValid || status === "loading"}
                className={`blackbutton ${
                  !formik.isValid || status === "loading"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {status === "loading" ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

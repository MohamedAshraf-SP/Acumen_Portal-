import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
    FaUserCircle,
    FaEnvelope,
    FaUserShield,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import { useAuth } from "../Contexts/AuthContext";
import { getItem } from "../services/globalService";

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [userData, setUserData] = useState(null);
    const { user } = useAuth();

     useEffect(() => {
        const fetchUser = async () => {
            if (!user?.id) return;
            try {
                const data = await getItem("users", user.id);
                setUserData(data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUser();
    }, [user]);
    const formik = useFormik({
        initialValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: yup.object({
            currentPassword: yup.string().required("Enter your current password"),
            newPassword: yup
                .string()
                .required("Enter your new password")
                .min(6, "Must be at least 6 characters"),
            confirmPassword: yup
                .string()
                .required("Confirm your password")
                .oneOf([yup.ref("newPassword")], "Passwords must match"),
        }),
        onSubmit: (values, { resetForm }) => {
            setLoading(true);
            setTimeout(() => {
                alert("Password updated successfully!");
                setLoading(false);
                resetForm();
            }, 1500);
        },
    });

    return (
        <div className="min-h-screen flex items-start justify-center p-6">
            <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12  border border-gray-100 dark:border-gray-700 ">
                {/* Profile Header */}
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                    Profile Overview
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                     <div className="flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 shadow-inner">
                        <div className="p-1 border-2 border-blue-200 rounded-full bg-white">
                            <FaUserCircle
                                className="text-sky-600 dark:text-blue-400"
                                size={80}
                            />
                        </div>
                        <div className="text-start mt-3">
                            {/* <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                {userData?.name || "Loading..."}
                            </h3> */}
                            <div className="flex items-center mt-2 text-gray-600 dark:text-gray-300">
                                <FaEnvelope className="mr-2" />
                                <span>{userData?.userName || "Loading..."}</span>
                            </div>
                            <div className="flex items-center mt-2 text-green-600 dark:text-green-400 font-medium">
                                <FaUserShield className="mr-2" />
                                <span>{userData?.userRole || "User"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right - Change Password */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 border-b pb-2">
                            Change Password
                        </h3>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            {/* Current Password */}
                            <PasswordInput
                                label="Current Password"
                                name="currentPassword"
                                value={formik.values.currentPassword}
                                error={formik.errors.currentPassword}
                                touched={formik.touched.currentPassword}
                                show={showPasswords.current}
                                onToggle={() =>
                                    setShowPasswords((prev) => ({
                                        ...prev,
                                        current: !prev.current,
                                    }))
                                }
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {/* New Password */}
                            <PasswordInput
                                label="New Password"
                                name="newPassword"
                                value={formik.values.newPassword}
                                error={formik.errors.newPassword}
                                touched={formik.touched.newPassword}
                                show={showPasswords.new}
                                onToggle={() =>
                                    setShowPasswords((prev) => ({
                                        ...prev,
                                        new: !prev.new,
                                    }))
                                }
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {/* Confirm Password */}
                            <PasswordInput
                                label="Confirm Password"
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                error={formik.errors.confirmPassword}
                                touched={formik.touched.confirmPassword}
                                show={showPasswords.confirm}
                                onToggle={() =>
                                    setShowPasswords((prev) => ({
                                        ...prev,
                                        confirm: !prev.confirm,
                                    }))
                                }
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || !formik.isValid}
                                className={`w-full mt-4 bg-[#2253ad] hover:bg-blue-800 text-white font-semibold rounded-full py-3 flex justify-center items-center gap-2 shadow-md transition-all ${loading || !formik.isValid
                                        ? "opacity-60 cursor-not-allowed"
                                        : ""
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <ImSpinner8 className="animate-spin" size={18} />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

 const PasswordInput = ({
    label,
    name,
    value,
    error,
    touched,
    show,
    onToggle,
    onChange,
    onBlur,
}) => (
    <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {label}
        </label>
        <input
            type={show ? "text" : "password"}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder="••••••••"
            className={`w-full rounded-lg border px-4 py-3 text-gray-800 dark:text-white bg-transparent    ${error && touched ? "border-red-500" : "border-gray-300"
                }`}
        />
        <div
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={onToggle}
        >
            {show ? <FaEyeSlash /> : <FaEye />}
        </div>
        {touched && error && (
            <p className="text-red-600 text-sm mt-1">{error}</p>
        )}
    </div>
);

export default Profile;

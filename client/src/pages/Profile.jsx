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
import { useDispatch } from "react-redux";
import { addNewData } from "../Rtk/slices/addNewSlice";
import { setsuccessmsg } from "../Rtk/slices/settingSlice";

const Profile = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    useEffect(() => {
        if (!user?.id) return;

        const fetchUser = async () => {
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
                .oneOf([yup.ref("newPassword")], "Passwords must match")
                .required("Confirm your password"),
        }),

        onSubmit: async (values, { resetForm }) => {
            if (!user?.id) return;

            setLoading(true);

            try {
                
                const response = await dispatch(
                    addNewData({
                        path: "update-password",
                        itemData: {
                            userId: user.id,
                            currentPassword: values.currentPassword,
                            newPassword: values.newPassword,
                        },
                    })
                ).unwrap();
                if (response?.success) {
                    dispatch(
                        setsuccessmsg({
                            success: true,
                            message: "Password updated successfully",
                        })
                    );

                    resetForm();
                }else
                {
                    dispatch(
                        setsuccessmsg({
                            success: false,
                            message: "error during update password",
                        })
                    );

                }
            } catch (error) {
                console.error("Update password error:", error);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="min-h-screen flex items-start justify-center p-6">
            <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 border">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Profile Overview
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="flex flex-col items-center bg-blue-50 rounded-2xl p-6">
                        <FaUserCircle size={80} className="text-blue-600" />

                        <div className="mt-4">
                            <div className="flex items-center gap-2">
                                <FaEnvelope />
                                {userData?.userName || "Loading..."}
                            </div>

                            <div className="flex items-center gap-2 text-green-600 mt-2">
                                <FaUserShield />
                                {userData?.userRole || "User"}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4 border-b pb-2">
                            Change Password
                        </h3>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            <PasswordInput
                                label="Current Password"
                                name="currentPassword"
                                {...formik}
                                show={showPasswords.current}
                                onToggle={() =>
                                    setShowPasswords(p => ({ ...p, current: !p.current }))
                                }
                            />

                            <PasswordInput
                                label="New Password"
                                name="newPassword"
                                {...formik}
                                show={showPasswords.new}
                                onToggle={() =>
                                    setShowPasswords(p => ({ ...p, new: !p.new }))
                                }
                            />

                            <PasswordInput
                                label="Confirm Password"
                                name="confirmPassword"
                                {...formik}
                                show={showPasswords.confirm}
                                onToggle={() =>
                                    setShowPasswords(p => ({ ...p, confirm: !p.confirm }))
                                }
                            />

                            <button
                                type="submit"
                                disabled={loading || !(formik.isValid && formik.dirty)}
                                className="w-full bg-blue-700 text-white rounded-full py-3 flex justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <ImSpinner8 className="animate-spin" />
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
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    show,
    onToggle,
}) => (
    <div className="relative">
        <label className="text-sm">{label}</label>

        <input
            type={show ? "text" : "password"}
            name={name}
            value={values[name]}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full border rounded-lg px-4 py-3 ${errors[name] && touched[name] ? "border-red-500" : ""
                }`}
        />

        <span
            className="absolute right-3 top-9 cursor-pointer"
            onClick={onToggle}
        >
            {show ? <FaEyeSlash /> : <FaEye />}
        </span>

        {errors[name] && touched[name] && (
            <p className="text-red-500 text-sm">{errors[name]}</p>
        )}
    </div>
);

export default Profile;

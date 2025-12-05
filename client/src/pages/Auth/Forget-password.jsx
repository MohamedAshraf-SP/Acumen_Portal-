import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { HiOutlineLockClosed } from "react-icons/hi";
import { ImSpinner8 } from "react-icons/im";
import { useNavigate } from 'react-router-dom';
import { setsuccessmsg } from "../../Rtk/slices/settingSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addItem } from "../../services/globalService";
const ForgetPassword = () => {
    const Navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: yup.object({
            email: yup
                .string()
                .required("Please enter your email")
                .email("Please enter a valid email"),
        }),
        onSubmit: async (values) => {
            try{
            setLoading(true);
            const response = await addItem("auth/resetpassword", { email: values.email
            });
             dispatch(
                setsuccessmsg({
                    success: true,
                    message: response?.message,
                })
            ); 
            setLoading(false);
            Navigate('/auth/success-confirm');
            }catch(error){
                setLoading(false);
            }

        },
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-md rounded-2xl p-10">
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
                    Forgot Password
                </h1>
                <p className="text-start text-sm text-gray-600 dark:text-gray-300 mb-6">
                    Don’t worry! Enter your email and we’ll be able to reset your password .
                </p>

                <form onSubmit={formik.handleSubmit} noValidate={true} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                        >
                            Enter your email address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            className={`w-full rounded-lg border px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 ${formik.errors.email && formik.touched.email
                                ? "border-red-500"
                                : "border-gray-300"
                                }`}
                            placeholder="name@company.com"
                            required
                        />
                        {formik.touched.email && formik.errors.email && (
                            <p className="text-red-600 italic mt-1 text-sm">
                                {formik.errors.email}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-[#2253ad] hover:bg-blue-700 text-white flex items-center justify-center gap-2 text-md font-semibold rounded-full py-3 transition-all duration-300 shadow-sm ${formik.isSubmitting || !formik.isValid
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer"
                            }`}
                        disabled={formik.isSubmitting || !formik.isValid}
                    >
                        {loading ? (
                            <>
                                <ImSpinner8 className="animate-spin" size={18} />
                                Loading...
                            </>
                        ) : (
                            <>
                                <HiOutlineLockClosed size={18} />
                                Send Reset Link
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
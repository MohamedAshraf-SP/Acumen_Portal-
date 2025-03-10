import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../Contexts/AuthContext";
import { HiOutlineLockClosed } from "react-icons/hi";
import { ImSpinner8 } from "react-icons/im";
import { PiEyeClosedBold } from "react-icons/pi";
import { FaEye } from "react-icons/fa6";
import { AiFillExclamationCircle } from "react-icons/ai";
import LoginImg from "/images/Login/LoginImg.png";
const Login = () => {
  const { handleLogin } = useAuth();
  const [wrongCreditionls, setwrongCreditionls] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter a valid email")
        .required("email is required."),
      password: Yup.string()
        .min(5, "password cant be less than 5 digit")
        .required("Password is required."),
    }),
    onSubmit: async (values) => {
      setwrongCreditionls(false);
      const response = await handleLogin(values);
      if (response.status === 401) {
        setwrongCreditionls(true);
      }
    },
  });
  return (
    <>
      <div className="h-screen grid grid-cols-12">
        <section className="bg-gray-50 dark:bg-gray-900 my-auto col-span-12 md:col-span-6">
          <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto md:h-screen lg:py-0">
            <a
              href="#"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
              <img
                className="w-8 h-8 mr-2"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                alt="logo"
              />
              Account Management Software
            </a>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-2 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-medium text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                {/* wrong email and password */}
                {wrongCreditionls && (
                  <div className="flex flex-row items-center justify-start text-sm font-semibold gap-2 text-gray-200 bg-red-400 rounded-lg px-2 py-3">
                    <AiFillExclamationCircle
                      size={18}
                      className="text-gray-100"
                    />
                    <p className="capitailize">
                      Email or password is Wrong, try again
                    </p>
                  </div>
                )}
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={formik.handleSubmit}
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      id="email"
                      className={`customInput ${
                        formik.errors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="name@company.com"
                      required=""
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-600 italic mt-1 text-[12px]">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        min={0}
                        id="password"
                        placeholder="••••••••"
                        className={`customInput
                        ${
                          formik.errors.password
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        required=""
                      />
                      <span
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEye size={18} />
                        ) : (
                          <PiEyeClosedBold size={18} />
                        )}
                      </span>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-600 italic mt-1 text-[12px]">
                        {formik.errors.password}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-end">
                    <a
                      href="#"
                      className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className={` w-full bg-sky-700 text-white flex items-center justify-center gap-2 text-md rounded-full p-3 ${
                      !formik.isValid || !formik.dirty
                        ? "cursor-not-allowed opacity-.5"
                        : "cursor-pointer"
                    }`}
                    disabled={formik.isSubmitting || !formik.isValid}
                  >
                    {formik.isSubmitting ? (
                      <ImSpinner8
                        className="rotate animate-spin transition "
                        size={20}
                      />
                    ) : (
                      <HiOutlineLockClosed size={15} />
                    )}

                    {formik.isSubmitting ? "loading.." : "Login"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <div className="md:col-span-5  overflow-hidden md:flex items-center justify-center w-90 h-90 hidden ">
          <img src={LoginImg} className="w-full h-full" />
        </div>
      </div>
    </>
  );
};

export default Login;

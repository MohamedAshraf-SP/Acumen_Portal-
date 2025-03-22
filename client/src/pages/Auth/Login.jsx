import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { HiOutlineLockClosed } from "react-icons/hi";
import { ImSpinner8 } from "react-icons/im";
import { PiEyeClosedBold } from "react-icons/pi";
import { FaEye } from "react-icons/fa6";
import { AiFillExclamationCircle } from "react-icons/ai";
import PortalLogo from "/images/DashboardLogo/logo.svg";
import LoginImg from "/images/Login/Design-stats-pana.svg";
import { useAuth } from "../../Contexts/AuthContext";

const Login = () => {
  const { handleLogin, loading } = useAuth();
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string()

        .email("Please enter a valid email")
        .required("Email is required."),
      password: Yup.string()
        .min(5, "Password can't be less than 5 digits")
        .required("Password is required."),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await handleLogin(values);
      } catch (error) {
        console.log(error);
        setWrongCredentials(true);
      }
    },
  });
  console.log(wrongCredentials);
  return (
    <div className="h-screen grid grid-cols-12 bg-gray-50">
      <section className="  dark:bg-gray-900 my-auto  col-span-12 md:col-span-5  ">
        <div className="flex flex-col items-center justify-center px-6 mx-auto   lg:py-0">
          <div className="flex flex-row items-center justify-center gap-2  ">
            <img
              className="w-10 h-10"
              src={PortalLogo}
              loading="lazy"
              alt="logo"
            />
            <h1 className="text-3xl font-semibold text-gray-700 dark:text-white">
              AMS Software
            </h1>
          </div>
          <div className="w-full dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700   ">
            <div className="flex flex-col sm:p-2">
              <p className="text-sm font-medium text-center text-[#747787] dark:text-white mb-4 md:mb-0 ">
                Let's get started, Sign in To Your Account
              </p>
              <form
                className="space-y-4 md:space-y-6 md:mt-10"
                onSubmit={formik.handleSubmit}
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`customInput ${
                      formik.errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="name@company.com"
                    required
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
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      placeholder="••••••••••••"
                      className={`customInput ${
                        formik.errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
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

                {wrongCredentials && (
                  <div className="flex items-start gap-2 text-sm font-normal text-red-500">
                    <AiFillExclamationCircle size={18} />
                    <p>Email or password is incorrect, please try again.</p>
                  </div>
                )}

                <div className="flex items-center justify-end">
                  <a
                    href="#"
                    className="text-sm text-[#3c6bc2] font-medium hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className={`w-full bg-[#3c6bc2] hover:opacity-85 text-white flex items-center justify-center gap-2 text-md rounded-full p-3 ${
                    formik.isSubmitting || !formik.isValid
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }`}
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {loading ? (
                    <>
                      <ImSpinner8 className="animate-spin" size={15} />
                      Loading...
                    </>
                  ) : (
                    <>
                      <HiOutlineLockClosed size={15} />
                      Login
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="md:col-span-7 w-full overflow-hidden rounded-tl-[60px] hidden md:block bg-[#2253ad]">
        <div className="mt-20 px-10 flex flex-col gap-3">
          <h1 className="text-2xl text-[#f9fcff] font-medium capitalize leading-8">
            Control Your Business Automatically <br /> with our Smart Portal
          </h1>
          <p className="text-[#d3d8d0] text-base font-thin">
            Invest intelligently, save your time, and discover a better way{" "}
            <br /> to manage your staff.
          </p>
        </div>
        <div className="w-full h-full flex flex-col items-center mt-6 justify-start overflow-hidden">
          <img
            src={LoginImg}
            loading="lazy"
            alt="Login"
            className="lg:w-[600px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

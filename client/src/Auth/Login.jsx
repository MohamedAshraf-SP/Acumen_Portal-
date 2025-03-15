import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../Contexts/AuthContext";
import { HiOutlineLockClosed } from "react-icons/hi";
import { ImSpinner8 } from "react-icons/im";
import { PiEyeClosedBold } from "react-icons/pi";
import { FaEye } from "react-icons/fa6";
import { AiFillExclamationCircle } from "react-icons/ai";
import PortalLogo from "/images/DashboardLogo/logo.svg";
import LoginImg from "/images/Login/Design-stats-pana.svg";
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
      <div className="h-screen grid grid-cols-12 ">
        <section className="bg-gray-50 dark:bg-gray-900 my-auto col-span-12 md:col-span-5">
          <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto md:h-screen lg:py-0">
            <div className="flex flex-row items-center justify-center gap-2">
              <img
                className="w-10 h-10 "
                src={PortalLogo}
                loading="lazy"
                alt="logo"
              />
              <p className="flex items-center  text-3xl font-semibold text-gray-800 dark:text-white">
                AMS Software
              </p>
            </div>
            <div className="w-full   dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-2 flex flex-col  gap-2 sm:p-8">
                <h1 className="text-xl font-semibold text-center leading-tight tracking-tight text-gray-600 md:text-2xl dark:text-white">
                  Welcome Back 👋
                </h1>
                <p className="text-sm  font-medium text-center  text-[#747787]  dark:text-white">
                  Let's get started , Sign in To Your Account
                </p>
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
                  className="space-y-4 md:space-y-6 md:mt-10"
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
                      className="text-sm text-[#5149DC] font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className={` w-full bg-[#5149DC] text-white flex items-center justify-center gap-2 text-md rounded-full p-3 ${
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
        <div className="md:col-span-7 w-full overflow-hidden  rounded-tl-[60px] hidden md:block   bg-[#5149DC]">
          <div className="mt-20 px-10 flex flex-col  gap-3">
            <h1 className="text-2xl text-[#f9fcff]  font-medium capitalize leading-8">
              Control Your Business automatic
              <br /> with our smart portal
            </h1>
            <p className="text-[#d3d8d0] text-base font-thin">
              invest intelligently ,save your time and discover a better way
              <br /> to manage your staff
            </p>
          </div>
          <div className="w-full h-full  flex flex-col items-center mt-6 justify-start overflow-hidden">
            <img
              src={LoginImg}
              loading="lazy"
              alt="Login image"
              className=" lg:w-[600px] "
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

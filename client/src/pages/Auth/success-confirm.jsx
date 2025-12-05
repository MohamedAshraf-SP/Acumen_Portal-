import React from "react";
import { IoIosUnlock } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
    const navigate = useNavigate();
    const handleLogin = () => {
        // simple redirect for React Router or fallback
        navigate("/auth/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
            <div className="bg-white  rounded-2xl px-8 py-10 max-w-xl w-full text-center border border-green-100 animate-fadeIn">
                {/* success animation */}
                <div className="flex items-center justify-center mb-6">
                    <img
                        src="/images/success/success.gif"
                        width="160"
                        height="160"
                        alt="Success animation"
                        className="rounded-full"
                    />
                </div>

                {/* text content */}
                <h1 className="text-3xl font-bold text-blue-600 mb-2">Success 🎉</h1>
                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                    Welcome to Acumman Portal 👋
                </h2>
                <p className="text-gray-500 font-medium mb-6">
                    Login now and start your journey with Acumman.
                </p>

                <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-2 bg-[#2253ad] hover:bg-blue-700 hover:transition-all text-white font-semibold py-3 px-6 rounded-xl"
                >
                    Login now
                    <IoIosUnlock size={18} />
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;

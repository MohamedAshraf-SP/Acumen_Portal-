import React, { lazy, Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LuDot } from "react-icons/lu";
import { editCompanyLinks } from "../../assets";
import { getItem } from "../../services/globalService";
import FailedLoad from "/images/NodataFound/failedLoad.svg";
// Lazy load components
const Company = lazy(() => import("../../component/Edit_Company/Company"));
const Due_Dates = lazy(() => import("../../component/Edit_Company/Due_Dates"));
const Shareholder = lazy(() =>
  import("../../component/Edit_Company/Shareholder")
);
const Directors = lazy(() => import("../../component/Edit_Company/Directors"));
const Address = lazy(() => import("../../component/Edit_Company/Address"));
const CompanyDocuments = lazy(() =>
  import("../../component/Edit_Company/Company_Documents")
);
const BankDetails = lazy(() =>
  import("../../component/Edit_Company/BankDetails")
);
const Contact = lazy(() => import("../../component/Edit_Company/Contact"));

const EditCompany = () => {
  const routes = ["User Company", "Edit Company"]; // Displayed routes
  const [openedForm, setOpenedForm] = useState("Company");
  const { companyId } = useParams();
  //check if company exist
  const [companyExist, setCompanyExist] = useState(null);
  const getCompaniesDetails = async () => {
    try {
      const response = await getItem("Companies", companyId);
      if (response) {
        setCompanyExist(true);
      }
    } catch (error) {
      setCompanyExist(false);
    }
  };

  useEffect(() => {
    getCompaniesDetails();
  }, [companyId]);

  const renderComponent = () => {
    switch (openedForm) {
      case "Company":
        return <Company />;
      case "due dates":
        return <Due_Dates />;
      case "Shareholdes":
        return <Shareholder />;
      case "Directors":
        return <Directors />;
      case "Address":
        return <Address />;
      case "documents":
        return <CompanyDocuments />;
      case "bank details":
        return <BankDetails />;
      case "contact":
        return <Contact />;
      default:
        return null;
    }
  };

  return (
    <div className="py-4">
      {/* Display Routes */}
      <div>
        <ul className="flex flex-row items-center text-sm py-2">
          {routes.map((route, index) => (
            <li
              key={index}
              className={`flex flex-row items-center text-md ${
                index === routes.length - 1
                  ? "text-gray-400"
                  : "text-slate-900 dark:text-gray-200"
              }`}
            >
              {index > 0 && (
                <LuDot className="text-lg text-gray-400 font-bold" />
              )}
              {route}
            </li>
          ))}
        </ul>
      </div>
      {companyExist ? (
        <div className="my-10 lg:px-4 py-4">
          {/* Display Links */}
          <div className="flex flex-row items-center lg:gap-4 gap-6 flex-wrap px-4 rounded-lg">
            {editCompanyLinks?.map((item, index) => (
              <Link
                to={item?.link}
                key={index}
                className={`text-sm font-normal dark:text-gray-200 text-[15px] py-1 capitalize ${
                  openedForm === item.name
                    ? "text-[#1c1c1c] border-b-2 border-solid border-[#1c1c1c]"
                    : "text-[#999999] border-solid"
                }`}
                onClick={() => setOpenedForm(item?.name)}
              >
                {item?.name}
              </Link>
            ))}
          </div>
          {/* Dynamically Render Component */}
          <div className="py-4">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-[200px] my-auto  ">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-8 h-8 text-gray-300 animate-spin dark:text-gray-600 fill-slate-900 "
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              }
            >
              {renderComponent()}
            </Suspense>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-10 text-center">
          <div className="border-b border-solid border-slate-200 lg:px-20">
            <div className="w-60 h-60 my-4">
              <img
                src={FailedLoad}
                alt="failed load company"
                loading="lazy"
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center text-[20px] font-normal text-red-500">
              Failed load companies Please try again later
            </h1>
            <Link
              className="flex flex-row items-center justify-center gap-2 bg-[#000000] text-white py-2  rounded-md my-4 w-[170px] font-thin hover:opacity-[.7] transition"
              to="/"
            >
              Go back
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCompany;

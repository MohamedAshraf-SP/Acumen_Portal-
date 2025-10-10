import React, { lazy, Suspense, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { editCompanyLinks } from "../../assets";
import FailedLoad from "/images/NodataFound/failedLoad.svg";
import Breadcrumb from "../../component/Breadcrumb";
import Contentloader from "../../component/Contentloader";
import ComboBox from "../../component/ComboBox";
import { useDispatch, useSelector } from "react-redux";
import { FetchedItems } from "../../Rtk/slices/getAllslice";

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
const CmopanyDepartmets = lazy(() =>
  import("../../component/Edit_Company/companyDepartments")
);

const EditCompany = () => {
  const routes = ["User Company", "Edit Company"]; // Displayed routes
  const dispatch = useDispatch();
  const [openedForm, setOpenedForm] = useState("Company");
  const { companyId } = useParams();
  const [searchParams] = useSearchParams();
  const companyCode = searchParams?.get("companycode"); //if it come from company House Api
  //check if company exist
  // get all clients
  const clients = useSelector(
    (state) => state.getall.entities?.clients?.clients
  );
  const loading = useSelector((state) => state.getall?.status.clients);
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
      case "departments":
        return <CmopanyDepartmets />;
      default:
        return null;
    }
  };
  useEffect(() => {
    if (!clients?.length) {
      dispatch(FetchedItems({ path: "clients" }));
    }
  }, [companyCode]);
  return (
    <div className="py-4">
      {/* Display Routes */}
      <Breadcrumb routes={routes} />

      {!companyCode === undefined || !companyId === undefined ? (
        // fail load
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
            <h1 className="text-center text-sm font-normal text-red-500">
              Failed load companies Please try again later
            </h1>
            <Link
              className="flex flex-row items-center justify-center gap-2 bg-[#000000] text-white py-2  px-4 text-s rounded-md my-4 font-thin hover:opacity-[.7] transition"
              to="/"
            >
              Go back
            </Link>
          </div>
        </div>
      ) : (
        <div className="my-10 lg:px-4 py-4">
          {/* Display Links */}
          <div className="flex md:flex-row flex-col-reverse gap-6 md:gap-0 md:items-center justify-between">
            <div className="flex flex-row items-center lg:gap-4 gap-3 flex-wrap px-4 rounded-lg">
              {editCompanyLinks?.map((item, index) => (
                <Link
                  to={
                    companyCode
                      ? `/companies/editcompany?companycode=${companyCode}`
                      : companyId
                      ? `/companies/editcompany/${companyId}`
                      : "/companies/editcompany"
                  }
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
            {companyCode != undefined && (
              <div>
                <ComboBox
                  title="find your client"
                  arr={clients}
                  loading={loading}
                />
              </div>
            )}
          </div>
          {/* Dynamically Render Component */}
          <div className="py-4">
            <Suspense fallback={<Contentloader />}>
              {renderComponent()}
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditCompany;

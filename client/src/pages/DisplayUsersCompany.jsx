import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
// import icons
import { GoPlus } from "react-icons/go";

// import images
import noCompaniesFound from "/images/NoCompanies/Capture.webp";
// import components
import ViewClientCard from "../component/ViewClientCard";

export default function DisplayUsersCompany() {
  const api = import.meta.env.VITE_API_URL;
  const { itemId } = useParams(); // get UserId from params
  const [companies, setcompanies] = useState([]); //set companies in this state
  const [status, setstatus] = useState(""); //track api requuest status
  // get companies of user
  const getUserCompanies = async () => {
    try {
      setstatus("loading");
      const response = await axios.get(`${api}/clients/${itemId}/companies`);
      console.log(response);
      if (response.status == 200) {
        setcompanies(response?.data?.companies);
        setstatus("success");
      }
    } catch (error) {
      console.log(error);
      setstatus("failed");
    }
  };
  useEffect(() => {
    getUserCompanies();
  }, [itemId]);
  return (
    <div className="py-10 ">
      {status == "success" && companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {companies?.map((item) => (
            <ViewClientCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="  w-full h-full flex flex-col items-center justify-center gap-4  py-10  text-center">
          <div className="border-b border-solid border-slate-200 lg:px-20 ">
            <h1 className="text-xl font-medium">No data</h1>
            <div className="w-20 h-20  my-4">
              <img
                src={noCompaniesFound}
                alt="user didnt have company"
                loading="lazy"
                className="w-full h-full "
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center ">
            <h2 className="text-center text-[20px] font-normal text-[#000000]">
              You may need add a company
            </h2>
            <Link className="flex flex-row items-center justify-center gap-2 bg-[#000000] text-white py-2 px-4 rounded-md my-4 w-[170px] font-thin hover:opacity-[.7] transition">
              <GoPlus />
              Add Company
            </Link>
          </div>
        </div>
      )}
      {/* <ViewClientCard />
      <ViewClientCard />
      <ViewClientCard />
      <ViewClientCard />
      <ViewClientCard /> */}
    </div>
  );
}

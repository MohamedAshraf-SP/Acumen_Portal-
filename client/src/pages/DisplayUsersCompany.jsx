import React, { useEffect, useState } from "react";
import axios from "axios";
import ViewClientCard from "../component/ViewClientCard";
import { useParams } from "react-router-dom";

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
    <div className="grid grid-cols-1 md:grid-cols-3  gap-10 py-10">
      {companies?.map((item) => (
        <ViewClientCard key={item._id} item={item} />
      ))}
      {/* <ViewClientCard />
      <ViewClientCard />
      <ViewClientCard />
      <ViewClientCard />
      <ViewClientCard /> */}
    </div>
  );
}

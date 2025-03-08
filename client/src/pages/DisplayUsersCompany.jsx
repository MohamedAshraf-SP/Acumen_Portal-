import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
// import icons
import { GoPlus } from "react-icons/go";
// import images


export default function DisplayUsersCompany() {
  const api = import.meta.env.VITE_API_URL;
  const { itemId } = useParams(); // Get UserId from params
  const [companies, setCompanies] = useState([]); // Store companies
  const [status, setStatus] = useState(""); // Track API request status

  // Get user companies
  const getUserCompanies = async () => {
    try {
      setStatus("loading");
      const response = await axios.get(`${api}/clients/${itemId}/companies`);
      if (response.status === 200) {
        setCompanies(response?.data?.companies?.companies || []);
        setStatus("success");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setStatus("failed");
    }
  };

  useEffect(() => {
    getUserCompanies();
  }, [itemId]);

  // return (
  //   <div className="py-10">
  //     {status === "loading" ? (
  //       <div className="flex justify-center">
  //         <div className="flex items-center justify-center h-64">
  //           <svg
  //             aria-hidden="true"
  //             className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-slate-900"
  //             viewBox="0 0 100 101"
  //             xmlns="http://www.w3.org/2000/svg"
  //           >
  //             <path
  //               d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
  //               fill="currentColor"
  //             />
  //             <path
  //               d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
  //               fill="currentFill"
  //             />
  //           </svg>
  //         </div>
  //       </div>
  //     ) : status === "success" && companies.length > 0 ? (
  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
  //         {companies.map((item) => (
  //           <ViewClientCard key={item._id} item={item} />
  //         ))}
  //       </div>
  //     ) : status === "success" && companies.length === 0 ? (
  //       <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-10 text-center">
  //         <div className="border-b border-solid border-slate-200 lg:px-20">
  //           <h1 className="text-xl font-medium">No data</h1>
  //           <div className="w-20 h-20 my-4">
  //             <img
  //               src={noCompaniesFound}
  //               alt="user didn't have a company"
  //               loading="lazy"
  //               className="w-full h-full"
  //             />
  //           </div>
  //         </div>
  //         <div className="flex flex-col items-center justify-center">
  //           <h2 className="text-center text-[20px] font-normal text-[#000000]">
  //             You may need to add a company
  //           </h2>
  //           <Link
  //             className="flex flex-row items-center justify-center gap-2 bg-[#000000] text-white py-2 px-4 rounded-md my-4 w-[170px] font-thin hover:opacity-[.7] transition"
  //             to="/add-company"
  //           >
  //             <GoPlus />
  //             Add Company
  //           </Link>
  //         </div>
  //       </div>
  //     ) : status === "failed" ? (
  //       <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-10 text-center">
  //         <div className="border-b border-solid border-slate-200 lg:px-20">
  //           <div className="w-60 h-60 my-4">
  //             <img
  //               src={FailedLoad}
  //               alt="failed load company"
  //               loading="lazy"
  //               className="w-full h-full"
  //             />
  //           </div>
  //         </div>
  //         <div className="flex flex-col items-center justify-center">
  //           <h3 className="text-center text-[20px] font-normal text-red-500">
  //             Failed load companies Please try again later
  //           </h3>
  //           <Link
  //             className="flex flex-row items-center justify-center gap-2 bg-[#000000] text-white py-2  rounded-md my-4 w-[170px] font-thin hover:opacity-[.7] transition"
  //             to="/"
  //           >
  //             Go back
  //           </Link>
  //         </div>
  //       </div>
  //     ) : null}
  //   </div>
  // );
   const columns = [
     {
       title: "company Name",
       dataIndex: "companyName",
       key: "companyName",
       sorter: true,
     },
     {
       title: "client Manager",
       dataIndex: "clientName",
       key: "clientName",
       sorter: true,
       align: "center",
     },
     {
       title: "contact Person Name",
       dataIndex: "",
       key: "email",
       sorter: true,
       align: "center",
     },
     {
       title: "contact person Phone",
       dataIndex: "phone",
       key: "phone",
       sorter: true,
       align: "center",
     },
     {
       title: "company Email",
       dataIndex: "email",
       key: "email",
       sorter: true,
       align: "center",
     },
     {
       title: "company Phone",
       dataIndex: "telephone",
       key: "telephone",
       sorter: true,
       align: "center",
     },
     {
       title: "Actions",
       key: "actions",
       align: "center",
       render: (_, record) => (
         <ul className="flex items-center justify-center space-x-2">
           <li
             className="bg-[#D6F1E8] text-[#027968] hover:bg-[#027968] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
             onClick={() => handleAction("edit", "Companies", record._id)}
             title="Edit"
           >
             <MdOutlineModeEditOutline /> {/* Adjust icon size */}
           </li>
           <li
             className="bg-[#FFF2F2] text-[#FF0000] hover:bg-[#FF0000] hover:text-white text-[14px] w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer"
             onClick={() => handleAction("delete", "Companies", record._id)}
             title="Delete"
           >
             <FaRegTrashCan /> {/* Adjust icon size */}
           </li>
         </ul>
       ),
     },
   ];

   return (
     <>
       {show && targetId === selectedItem.companyId && (
         <ConfirmDelete
           path={selectedItem.path}
           deletedItemId={selectedItem.companyId}
         />
       )}

       <div className="my-8  rounded-lg  shadow-sm  bg-white overflow-hidden">
         {/* Header */}
         <div className=" p-4 flex flex-row items-center justify-between ">
           {/* Display Title */}
           <div>
             <h1 className="text-xl font-semibold">My Compaines</h1>
             <ul className="flex flex-row items-center space-x-1 text-sm py-2">
               {routes?.map((route, index) => (
                 <li
                   key={index}
                   className={`flex flex-row items-center ${
                     index === routes?.length - 1
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
           {/* Add company btn */}
           <Link to="/clients/add-Client" className="blackbutton">
             <GoPlus />
             Add Company
           </Link>
         </div>

         {/* Table */}
         <div className="my-8">
           {/* loading status */}
           {status === "loading" ? (
             <div className="flex justify-center">
               <div className="flex items-center justify-center h-64">
                 <svg
                   aria-hidden="true"
                   className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-slate-900"
                   viewBox="0 0 100 101"
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
               </div>
             </div>
           ) : status === "success" && companies?.length > 0 ? (
             <>
               <Table
                 columns={columns}
                 dataSource={companies}
                 pagination={false}
                 rowKey="_id"
                 rowClassName={(record, index) =>
                   index % 2 === 0 ? "bg-white" : "bg-gray-50"
                 }
               />
               <div className="mt-4 flex justify-end">
                 <Pagination
                   current={pagination.current}
                   pageSize={pagination.pageSize}
                   total={totalRecords}
                   onChange={onPageChange}
                 />
               </div>
             </>
           ) : status === "success" && companies?.length === 0 ? (
             <Empty
               image={Nodataimg}
               description="No Data Available Now"
               className="flex flex-col items-center"
             />
           ) : status === "success" ? (
             <p className="text-red-600">Failed to load data.</p>
           ) : null}
         </div>
       </div>
     </>
   );
}

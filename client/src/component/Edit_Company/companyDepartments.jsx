import { useState, useEffect } from "react";
import { updateItem } from "../../services/globalService";
import { useParams, useSearchParams } from "react-router-dom";
import { setsuccessmsg } from "../../Rtk/slices/settingSlice";
import { useDispatch } from "react-redux";
import { fetchCompanyDetails } from "../../Rtk/slices/Fetchcompanydetails"; 

const CompanyDepartments = ({ departments = [] }) => {
  const { companyId } = useParams();
  
  const dispatch = useDispatch();
  const allDepartments = [
    { _id: 1, name: "Annual accounts, CT and Director department" },
    { _id: 2, name: "Finance department" },
    { _id: 3, name: "General and administrative matters" },
    { _id: 4, name: "Paye, Pension and CIS department department" },
    { _id: 5, name: "Vat department" },
    { _id: 6, name: "Self-employed and partnership department" },
  ]; 
  const [searchParams] = useSearchParams();
   const [selectedDepartments, setSelectedDepartments] = useState(departments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedDepartments(departments);
  }, [departments]);

  const handleCheckboxChange = (deptName) => {
    setSelectedDepartments((prev) =>
      prev.includes(deptName)
        ? prev.filter((item) => item !== deptName)
        : [...prev, deptName]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (companyId)
      await updateItem("Companies", companyId, {
        departments: selectedDepartments,
      });

      dispatch(
        setsuccessmsg({
          success: true,
          message: "Departments updated successfully!",
        })
      );

       dispatch(fetchCompanyDetails({ companyId }));
       

    } catch (err) {
      console.error(err);
      dispatch(
        setsuccessmsg({
          message: "Error while updating departments!",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4 py-4 px-4 rounded-[16px] bg-[#f9f9fa] animate-fade">
      <div className="py-4 flex flex-row items-center">
        <h1 className="text-[15px] font-medium">Company Departments</h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allDepartments.map((department) => (
            <div key={department._id} className="flex items-start">
              <input
                id={`dept-${department._id}`}
                type="checkbox"
                checked={selectedDepartments.includes(department.name)}
                onChange={() => handleCheckboxChange(department.name)}
                className="cursor-pointer w-4 h-4 mr-2 appearance-none border border-gray-300 rounded-md checked:bg-[#1A7F64] outline-none"
              />
              <label
                htmlFor={`dept-${department._id}`}
                className="text-sm text-gray-600 dark:text-neutral-400"
              >
                {department.name}
              </label>
            </div>
          ))}
        </div>

        <div className="flex md:flex-row flex-col items-center justify-end gap-4 mt-10">
          <button
            type="button"
            className="bg-[#efeff0] px-4 font-normal rounded-md"
            onClick={() => setSelectedDepartments(departments)}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="blackbutton !rounded-xl"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyDepartments;

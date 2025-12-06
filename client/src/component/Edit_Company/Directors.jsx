import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import TextInput from "../TextInput"; // Text input component
// import icons
import { GoPlus } from "react-icons/go";
// import img
import NodataFond from "/images/NodataFound/nodata.webp";
import { setdeleteHintmsg, setsuccessmsg } from "../../Rtk/slices/settingSlice";
import ConfirmDelete from "../ConfirmDelete";
import { updateTargetItem } from "../../Rtk/slices/updateItemSlice";
const Directors = () => {
  const api = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const deletestatus = useSelector((state) => state.deleteItem.status);
  const UpdateStatus = useSelector((state) => state.updaateItem?.status);
  const { show, targetId } = useSelector(
    (state) => state.setting.deleteHintmsg
  );
  const [searchParams] = useSearchParams();
  const companyCode = searchParams?.get("companycode");
    const { companyId } = useParams(); //get company id from url
  const [loadingStatus, setLoadingStatus] = useState("idle"); // loading status
  const [data, setData] = useState([]); // set All data here after fetching
  const [newDirecotor, setNewDirecotor] = useState(null);
  const [selectedDirector, setSelectedDirector] = useState({});
  const [editedDirector, setEditedDirector] = useState({});
  // add new Form director
  const addNewDirector = () => {
    setNewDirecotor({
      dTitle: "",
      dateOfAppointment: "",
      dateOfResignation: "",
      dateRegistrationForSE: "",
      dName: "",
      dDateOfBirth: "",
      dUTR: "",
      dUTR_ID: "",
      dUTR_Password: "",
      dNIN: "",
    });
  };
  // save new director
  const saveNewDirector = async (values) => {
    try {
      setLoadingStatus(true);
      const response = await axios.post(
        `${api}/Companies/${companyId}/directors`,
        values
      );
      if (response.status === 201) {
        setNewDirecotor(null);
        get_User_Dierctors();
        dispatch(
          setsuccessmsg({
            success: true,
            message: "New Director adding success!",
          })
        );
        setLoadingStatus(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // cancel add new Director
  const cancelAddNewDirector = () => {
    setNewDirecotor(null);
  };
  // Fetch company details with an API request
  const get_User_Dierctors = async () => {
    try {
      setLoadingStatus("loading");
      const response = await axios.get(
        `${api}/Companies/${companyId}/directors`
      );

      if (response.status === 200) {
        setData((prevData) => {
          const newData = response?.data?.directors || [];
          if (JSON.stringify(prevData) !== JSON.stringify(newData)) {
            return newData;
          }
          return prevData; // Don't update if data is the same
        });
        setLoadingStatus("success");
      }
    } catch (error) {
      setLoadingStatus("failed");
      console.error(error);
    }
  };
  // delete selectedDirector
  const DeleteSelectedDirector = async (DirectorID) => {
    setSelectedDirector({
      DirectorID,
      path: "Companies/directors",
    });
    dispatch(setdeleteHintmsg({ show: true, targetId: DirectorID }));
  };
  // Memoize initialValues to avoid unnecessary re-renders
  const initialValues = useMemo(
    () => ({
      directors: data?.map((item) => ({
        id: item?._id || Date.now(),
        dTitle: item?.dTitle || "",
        dateOfAppointment: item?.dateOfAppointment || "",
        dateOfResignation: item?.dateOfResignation || "",
        dateRegistrationForSE: item?.dateRegistrationForSE || "",
        dName: item?.dName || "",
        dDateOfBirth: item?.dDateOfBirth || "",
        dUTR: item?.dUTR || "",
        dUTR_ID: item?.dUTR_ID || "",
        dUTR_Password: item?.dUTR_Password || "",
        dNIN: item?.dNIN || "",
      })),
    }),
    [data]
  );

  // Initialize Formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: async (values) => {
      if (editedDirector) {
        const editedDirectorresult = values.directors.find(
          (director) => director.id === editedDirector
        );
        try {
          dispatch(
            updateTargetItem({
              path: "Companies/directors",
              itemId: editedDirector,
              updatedItemData: editedDirectorresult,
            })
          );
          if (UpdateStatus === "success") {
            dispatch(
              setsuccessmsg({
                success: true,
                message: "Director updating success!",
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
  });
  useEffect(() => {
    if (!companyCode ) {
    get_User_Dierctors();
    }
  }, [companyCode]);
  // Load data again after delete item
  useEffect(() => {
    if (!companyCode && deletestatus === "success" && !show) {
      get_User_Dierctors(); // Refresh UI after deletion
    }
  }, [deletestatus, show, companyCode]);
  
  return (
    <div className="my-4 py-4 px-6 rounded-[16px] bg-[#f9f9fa] animate-fade">
      <div className="py-2 flex flex-row items-center justify-between ">
        <h1 className="text-[15px] font-medium">Directors</h1>
        <button
          type="submit"
          className="blackbutton"
          onClick={() => addNewDirector()}
        >
          <GoPlus size={16} />
          Add Director
        </button>
      </div>
      {/* Delete component */}
      {show && targetId === selectedDirector.DirectorID && (
        <ConfirmDelete
          path={selectedDirector.path}
          deletedItemId={selectedDirector.DirectorID}
        />
      )}
      {loadingStatus === "loading" && <p>Loading...</p>}

      {formik.values.directors.length > 0 && loadingStatus === "success" && (
        <div className="py-4">
          {formik.values.directors.map((Director, index) => (
            <form
              onSubmit={formik.handleSubmit}
              className="py-4"
              key={Director.id}
            >
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                key={Director.id}
              >
                <TextInput
                  label="Director Title"
                  id="Director Title"
                  type="text"
                  placeholder="Enter Director Title"
                  className="customInput"
                  name={`directors[${index}].dTitle`}
                  onChange={formik.handleChange}
                  value={formik.values.directors[index].dTitle}
                />

                <TextInput
                  label="Date of Appointment"
                  id="DateofAppointment"
                  type="date"
                  placeholder="Enter Date of Appointment"
                  className="customInput"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={`directors[${index}].dateOfAppointment`}
                  value={
                    formik?.values?.directors[index]?.dateOfAppointment ? (
                      new Date(
                        formik?.values?.directors[index]?.dateOfAppointment
                      )
                        .toISOString()
                        .split("T")[0]
                    ) : (
                      <span>N/A</span>
                    )
                  }
                  error={formik.errors.dateOfAppointment}
                  touched={formik.touched.dateOfAppointment}
                />
                <TextInput
                  label="Date of Resignation"
                  id="Date of Resignation"
                  type="date"
                  placeholder="Enter Date of Resignation"
                  className="customInput"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={`directors[${index}].dateOfResignation`}
                  value={
                    formik?.values?.directors[index]?.dateOfResignation ? (
                      new Date(
                        formik?.values?.directors[index]?.dateOfResignation
                      )
                        .toISOString()
                        .split("T")[0]
                    ) : (
                      <span>N/A</span>
                    )
                  }
                  error={formik.errors.dateOfResignation}
                  touched={formik.touched.dateOfResignation}
                />
                <TextInput
                  label="Date Registration for SE"
                  id="Date Registration for SE"
                  type="date"
                  placeholder="Enter Date Registration for SE"
                  className="customInput"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={`directors[${index}].dateRegistrationForSE`}
                  value={
                    formik?.values?.directors[index]?.dateRegistrationForSE ? (
                      new Date(
                        formik?.values?.directors[index]?.dateRegistrationForSE
                      )
                        .toISOString()
                        .split("T")[0]
                    ) : (
                      <span>N/A</span>
                    )
                  }
                  error={formik.errors.dateRegistrationForSE}
                  touched={formik.touched.dateRegistrationForSE}
                />
                <TextInput
                  label="Director Name"
                  id="Director Name"
                  type="string"
                  placeholder="Enter Director Name"
                  className="customInput"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={`directors[${index}].dName`}
                  value={formik.values.directors[index].dName}
                  error={formik.errors.dName}
                  touched={formik.touched.dName}
                />
                <TextInput
                  label="Director Date of Birth"
                  id="Director Date of Birth"
                  type="date"
                  placeholder="Enter Director Date of Birth"
                  className="customInput"
                  onChange={formik.handleChange}
                  onBl
                  name={`directors[${index}].dDateOfBirth`}
                  ur={formik.handleBlur}
                  value={
                    formik?.values?.directors[index]?.dDateOfBirth ? (
                      new Date(formik?.values?.directors[index]?.dDateOfBirth)
                        .toISOString()
                        .split("T")[0]
                    ) : (
                      <span>N/A</span>
                    )
                  }
                  error={formik.errors.dDateOfBirth}
                  touched={formik.touched.dDateOfBirth}
                />
                <TextInput
                  label="Director NIN"
                  id="Director NIN"
                  type="text"
                  placeholder="Enter Director NIN"
                  className="customInput"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={`directors[${index}].dNIN`}
                  value={formik.values.directors[index].dNIN}
                  error={formik.errors.dNIN}
                  touched={formik.touched.dNIN}
                />

                <TextInput
                  label="Director UTR"
                  id="Director UTR"
                  type="text"
                  placeholder="Enter Director UTR"
                  className="customInput"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={`directors[${index}].dUTR`}
                  value={formik.values.directors[index].dUTR}
                  error={formik.errors.dUTR}
                  touched={formik.touched.dUTR}
                />
                <TextInput
                  label="Director UTR ID"
                  id="Director UTR ID"
                  type="text"
                  placeholder="Enter Director UTR ID"
                  className="customInput"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={`directors[${index}].dUTR_ID`}
                  value={formik.values.directors[index].dUTR_ID}
                  error={formik.errors.dUTR_ID}
                  touched={formik.touched.dUTR_ID}
                />
                <TextInput
                  label="Director UTR Password"
                  id="Director UTR Password"
                  type="password"
                  placeholder="Enter Director UTR Password"
                  className="customInput"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name={`directors[${index}].dUTR_Password`}
                  value={formik.values.directors[index].dUTR_Password}
                  touched={formik.touched.dUTR_Password}
                />
              </div>
              <div className="flex md:flex-row flex-col items-center justify-end gap-4 mt-10">
                <button
                  type="button"
                  onClick={() =>
                    DeleteSelectedDirector(formik.values?.directors[index]?.id)
                  }
                  className={`bg-[#efeff0] px-4 font-normal rounded-md hover:text-white hover:bg-red-700 transition  ${
                    deletestatus == "loading"
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  {deletestatus == "loading" ? "Deleting..." : "Delete"}
                </button>
                <button
                  type="submit"
                  className="blackbutton !rounded-xl  "
                  onClick={() => setEditedDirector(Director.id)}
                >
                  update
                </button>
              </div>
            </form>
          ))}
        </div>
      )}
      {/* display new Directors */}
      {newDirecotor && (
        <form
          onSubmit={(e) => {
            e.preventDefault(), saveNewDirector(newDirecotor);
          }}
          className="py-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TextInput
              label="Director Title"
              id="Director Title"
              type="text"
              placeholder="Enter Director Title"
              className="customInput"
              name="dTitle"
              onChange={(e) =>
                setNewDirecotor((prev) => ({
                  ...prev,
                  dTitle: e.target.value,
                }))
              }
            />

            <TextInput
              label="Date of Appointment"
              id="DateofAppointment"
              type="date"
              placeholder="Enter Date of Appointment"
              className="customInput"
              onChange={(e) =>
                setNewDirecotor((prev) => ({
                  ...prev,
                  dateOfAppointment: e.target.value,
                }))
              }
              name="dateOfAppointment"
            />
            <TextInput
              label="Date of Resignation"
              id="Date of Resignation"
              type="date"
              placeholder="Enter Date of Resignation"
              className="customInput"
              name="dateOfResignation"
              onChange={(e) =>
                setNewDirecotor((prev) => ({
                  ...prev,
                  dateOfResignation: e.target.value,
                }))
              }
            />
            <TextInput
              label="Date Registration for SE"
              id="Date Registration for SE"
              type="date"
              placeholder="Enter Date Registration for SE"
              className="customInput"
              name="dateRegistrationForSE"
              onChange={(e) =>
                setNewDirecotor((prev) => ({
                  ...prev,
                  dateRegistrationForSE: e.target.value,
                }))
              }
            />
            <TextInput
              label="Director Name"
              id="Director Name"
              type="string"
              placeholder="Enter Director Name"
              className="customInput"
              name="dName"
              onChange={(e) =>
                setNewDirecotor((prev) => ({
                  ...prev,
                  dName: e.target.value,
                }))
              }
            />
            <TextInput
              label="Director Date of Birth"
              id="Director Date of Birth"
              type="date"
              placeholder="Enter Director Date of Birth"
              className="customInput"
              name="dDateOfBirth"
              onChange={(e) =>
                setNewDirecotor((prev) => ({
                  ...prev,
                  dDateOfBirth: e.target.value,
                }))
              }
            />
            <TextInput
              label="Director NIN"
              id="Director NIN"
              type="text"
              placeholder="Enter Director NIN"
              className="customInput"
              name="dNIN"
              onChange={(e) =>
                setNewDirecotor((prev) => ({
                  ...prev,
                  dNIN: e.target.value,
                }))
              }
            />

            <TextInput
              label="Director UTR"
              id="Director UTR"
              type="text"
              placeholder="Enter Director UTR"
              className="customInput"
              name="dUTR"
              onChange={(e) =>
                setNewDirecotor((prev) => ({
                  ...prev,
                  dUTR: e.target.value,
                }))
              }
            />
            <TextInput
              label="Director UTR ID"
              id="Director UTR ID"
              type="text"
              placeholder="Enter Director UTR ID"
              className="customInput"
              name="dUTR_ID"
              onChange={(e) =>
                setNewDirecotor((prev) => ({
                  ...prev,
                  dUTR_ID: e.target.value,
                }))
              }
            />
            <TextInput
              label="Director UTR Password"
              id="Director UTR Password"
              type="password"
              placeholder="Enter Director UTR Password"
              className="customInput"
              name="dUTR_Password"
              onChange={(e) =>
                setNewDirecotor((prev) => ({
                  ...prev,
                  dUTR_Password: e.target.value,
                }))
              }
            />
          </div>
          <div className="flex md:flex-row flex-col items-center justify-end gap-4 mt-10">
            <button
              type="button"
              className="bg-[#efeff0] px-4 font-normal rounded-md"
              onClick={() => cancelAddNewDirector()}
            >
              Cancel
            </button>
            <button type="submit" className="blackbutton !rounded-xl    ">
              Save Changes
            </button>
          </div>
        </form>
      )}
      {/* display No shareholder Img */}
      {formik.values.directors.length === 0 &&
        loadingStatus === "success" &&
        !newDirecotor && (
          <div className="flex flex-col items-center justify-center mt-10">
            <img
              src={NodataFond}
              alt="No Data Found"
              className="rounded-full bg-blue-50 p-2 w-24 h-24"
            />
            <p className="text-center  text-sm font-normal text-gray-500">
              This company has no shareholders.
              <br /> Try adding a new one now.
            </p>
          </div>
        )}
    </div>
  );
};

export default Directors;

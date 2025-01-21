import { useDispatch } from "react-redux";
import { deleteTargetItem } from "../Rtk/slices/deleteItemSlice";
import { setdeleteHintmsg, setsuccessmsg } from "../Rtk/slices/settingSlice";
import { FetchedItems } from "../Rtk/slices/getAllslice";
import React, { useState } from "react";

function ConfirmDelete({ path, deletedItemId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    // Remove path argument here
    try {
      setLoading(true);
      const response = await dispatch(
        deleteTargetItem({ path, itemId: deletedItemId })
      );
      if (response.meta.requestStatus === "fulfilled") {
        dispatch(
          setsuccessmsg({
            success: true,
            message: "Item deleted successfully!",
          })
        );
        setLoading(false);
        // Fetch the updated list of items after deletion
        dispatch(FetchedItems({ path }));
      }
    } catch (error) {
      dispatch(
        setsuccessmsg({
          success: false,
          fail: true,
          message: "Failed to delete the item.",
        })
      );
      console.error("Error deleting item:", error);
    } finally {
      // Close the delete confirmation modal
      dispatch(setdeleteHintmsg({ show: false, targetId: null }));
    }
  };

  const handleCancelDelete = () => {
    dispatch(setdeleteHintmsg({ show: false, targetId: null }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1c252e7a] z-40">
      <div
        className="w-[calc(100vw-64px)] max-h-[calc(100vh-64px)] max-w-[370px] bg-white
        rounded-lg px-[24px] py-4 [box-shadow:rgba(50,_50,_93,_0.25)_0px_50px_100px_-20px,_rgba(0,_0,_0,_0.3)_0px_30px_60px_-30px]"
      >
        <h4 className="font-semibold">Delete</h4>
        <div className="pt-1 text-[0.875rem] leading-[1.57143] font-normal">
          <p>Are you sure you want to delete?</p>
          <div className="flex flex-row items-center justify-end mt-4 gap-2 text-sm">
            <button
              className={`bg-red-500 text-white hover:bg-[#B71D18] py-[2px] ${
                loading ? "cursor-not-allowed opacity-[.5]" : ""
              }`}
              onClick={handleDelete} // Use handleDelete directly
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <button onClick={handleCancelDelete} className="py-[2px]">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ConfirmDelete);

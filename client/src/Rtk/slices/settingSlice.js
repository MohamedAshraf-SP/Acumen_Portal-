import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  screenSize: undefined,
  activeMenu: true,
  isClicked: {
    Settings: false,
    UserProfile: false,
  },
  collapsed: false,
  deleteHintmsg: false,
  editItemForm: false,
  ViewClient: false,
  successmsg: [],
};
const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setScreenSize: (state, action) => {
      state.screenSize = action.payload;
    },
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload;
    },
    setIsClicked: (state, action) => {
      const clicked = action.payload;
      state.isClicked = {
        Settings: false,
        UserProfile: false,
        [clicked]: true,
      };
    },
    removeClick: (state, action) => {
      const clicked = action.payload;
      state.isClicked = {
        Settings: false,
        UserProfile: false,
        [clicked]: false,
      };
    },
    setCollapsed: (state, action) => {
      state.collapsed = action.payload;
    },
    setdeleteHintmsg: (state, action) => {
      state.deleteHintmsg = action.payload;
    },
    seteditItemForm: (state, action) => {
      state.editItemForm = action.payload;
    },
    setViewClient: (state, action) => {
      state.ViewClient = action.payload;
    },
    setsuccessmsg: (state, action) => {
      state.successmsg.push(action.payload);
    },
    clearSuccessMsg: (state) => {
      state.successmsg = []; // Clear all messages
    },
  },
});
export const {
  setScreenSize,
  setActiveMenu,
  setIsClicked,
  removeClick,
  setCollapsed,
  setdeleteHintmsg,
  setsuccessmsg,
  seteditItemForm,
  clearSuccessMsg,
  setViewClient,
} = settingSlice.actions;

export default settingSlice.reducer;

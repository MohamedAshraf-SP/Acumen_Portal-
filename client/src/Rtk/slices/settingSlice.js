import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  screenSize: undefined,
  activeMenu: true,
  isClicked: {
    Settings: false,
    UserProfile: false,
  },
  collapsed: false,
  deleteHintmsg: {
    show: false,
    targetId: null,
  },
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
      state.deleteHintmsg.show = action.payload.show;
      state.deleteHintmsg.targetId = action.payload.targetId;
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

    replaceSuccessMsgs: (state, action) => {
      state.successmsg = action.payload;
    },

    clearSuccessMsg: (state) => {
      state.successmsg = [];
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
  seteditItemForm,
  clearSuccessMsg,
  setViewClient,
  setsuccessmsg,
  replaceSuccessMsgs,
} = settingSlice.actions;

export default settingSlice.reducer;

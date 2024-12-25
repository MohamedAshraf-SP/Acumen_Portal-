import React, { createContext, useContext, useState } from "react";

// Create the context
const stateContext = createContext();

// Initial state (optional)
const initialState = {
  Settings: false,
  UserProfile: false,
};

// Context provider
export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [collapsed, setIsCollapsed] = useState(false);
  const [Deletemsg, showDeletemsg] = useState(false);
  const [confirmmsg, setconfirmmsg] = useState(false);
  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });
  const removeClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: false });
  return (
    <stateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        screenSize,
        setScreenSize,
        isClicked,
        setIsClicked,
        handleClick,
        removeClick,
        // collapse sidebar
        setIsCollapsed,
        collapsed,
        // deletemsg
        Deletemsg,
        showDeletemsg,

        // confirmMessage
        setconfirmmsg,
        confirmmsg,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};

// Custom hook to use context
export const useStateContext = () => useContext(stateContext);

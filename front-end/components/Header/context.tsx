import React, { useState, useContext } from "react";

interface initialState {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const HeaderContext = React.createContext({} as initialState);

const HeaderProvider: React.FC = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <HeaderContext.Provider
      value={{
        isSidebarOpen,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export const useGlobalHeaderContext = () => {
  return useContext(HeaderContext);
};

export { HeaderProvider, HeaderContext };

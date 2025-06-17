import { createContext, useContext, useState } from "react";

const HeaderHeightContext = createContext();
const SetHeaderHeightContext = createContext();

export const useHeaderHeight = () => useContext(HeaderHeightContext);
export const useSetHeaderHeight = () => useContext(SetHeaderHeightContext);

export const HeaderHeightProvider = ({ children }) => {
  const [headerHeight, setHeaderHeight] = useState(0);
  return (
    <HeaderHeightContext.Provider value={headerHeight}>
      <SetHeaderHeightContext.Provider value={setHeaderHeight}>
        {children}
      </SetHeaderHeightContext.Provider>
    </HeaderHeightContext.Provider>
  );
};


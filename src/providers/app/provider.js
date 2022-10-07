import { useState } from "react";
import { AppContext } from "./context";

const AppProvider = ({ children }) => {
    const initialState = {
        searchOpen: false,
        isSuccess: false,
        isFetched: false,
        options: {},
    }
  const [app, setAppData] = useState(initialState);
  return (
    <AppContext.Provider value={{ app, setAppData }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
import { useState } from "react";
import { AuthContext } from "./context";

const AuthProvider = ({ children }) => {
    const initialState = {
      user: null,
      error: '',
      isLoggedIn: false,
      isSignUp: false,
      isError: false,
      options: {},
    }
  const [auth, setAuthData] = useState(initialState);
  return (
    <AuthContext.Provider value={{ auth, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
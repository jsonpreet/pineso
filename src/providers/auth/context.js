import React, { useContext } from 'react';

export const AuthContext = React.createContext({
    user: null,
    error: '',
    isLoggedIn: false,
    isSignUp: false,
    isError: false,
    options: {},
});

export const useAuth = () => useContext(AuthContext);
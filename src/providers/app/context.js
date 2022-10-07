import React, { useContext } from 'react';

export const AppContext = React.createContext({
    searchOpen: false,
    isSuccess: false,
    isFetched: false,
    options: {},
});

export const useApp = () => useContext(AppContext);
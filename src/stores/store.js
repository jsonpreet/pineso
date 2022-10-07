import create from 'zustand';
import { persist } from 'zustand/middleware';

const useApp = create(
    persist(
        (set, get) => ({
            user: {},
            isLoggedIn: false,
            setUser: (params) => {
                set((state) => ({
                    user: params,
                }));
            },
            setLoggedIn: (params) => {
                set((state) => ({
                    isLoggedIn: params,
                }));
            },
        }),
        { name: 'pineso' }
    )
);
export default useApp;
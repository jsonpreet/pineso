import create from 'zustand';
import { persist } from 'zustand/middleware';

const useApp = create(
    persist(
        (set, get) => ({
            user: {},
            recentSearch: [],
            isLoggedIn: false,
            setUser: (params) => {
                set((state) => ({
                    user: params,
                }));
            },
            setSearch: (params) => {
                set((prev) => ({
                    recentSearch: [...prev.recentSearch, params],
                }));
            },
            setLoggedIn: (params) => {
                set((state) => ({
                    isLoggedIn: params,
                }));
            },
            resetSearch: () => {
                set((state) => ({
                    recentSearch: [],
                }));
            }
        }),
        { name: 'pineso' }
    )
);
export default useApp;
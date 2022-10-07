import create from 'zustand'

export const useUserStore = create((set) => ({
    isLoggedIn: false,
    isSignUp: false,
    isError: false,
    error: '',
    user: [],
    setUser : (user) => set({ user }),
    setIsError: (isError) => set({ isError }),
    setSignUp: (isSignUp) => set({ isSignUp }),
    setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    setError: (error) => set({ error }),
}))
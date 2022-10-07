import create from 'zustand'

export const useAppStore = create((set) => ({
    isFetched: false,
    isSuccess: false,
    isLoading: false,
    isError: false,
    error: '',
    setFetched: (isFetched) => set({ isFetched }),
    setSuccess: (isSuccess) => set({ isSuccess }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
}))
import create from 'zustand'

export const usePinsStore = create((set) => ({
    isFetched: false,
    isSuccess: false,
    isLoading: false,
    isError: false,
    error: '',
    pins: [],
    setPins : (pins) => set({ pins }),
    setFetched: (isFetched) => set({ isFetched }),
    setSuccess: (isSuccess) => set({ isSuccess }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
}))
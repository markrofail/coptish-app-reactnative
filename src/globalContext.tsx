import { Dispatch, MutableRefObject, SetStateAction, createContext, useContext } from 'react'

interface GlobalRefs {
    currentPrayerId: string
    setCurrentPrayerId: Dispatch<SetStateAction<string>>
}

export const initDefaultGlobalRefs = (overrides?: Partial<GlobalRefs>): GlobalRefs => ({
    currentPrayerId: '',
    setCurrentPrayerId: () => {},
    ...overrides,
})

const GlobalContext = createContext<GlobalRefs>(initDefaultGlobalRefs())
export const GlobalContextProvider = GlobalContext.Provider
export const useGlobalContext = () => useContext(GlobalContext)

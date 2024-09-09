import React, { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { DarkTheme, LightTheme } from '../config'

type Theme = typeof LightTheme | typeof DarkTheme
type ThemeContext = { theme: Theme; toggleTheme: () => void }
const initialValue = { theme: LightTheme, toggleTheme: () => {} }

export const ThemeContext = createContext<ThemeContext>(initialValue)
export const useThemeContext = () => useContext(ThemeContext)

export const isLightTheme = (theme: Theme) => theme === LightTheme
export const isDarkTheme = (theme: Theme) => !isLightTheme(theme)

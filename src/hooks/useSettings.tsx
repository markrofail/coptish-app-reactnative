import { createContext, useEffect, useState, ReactNode, useContext } from 'react'
import * as Types from '../types'
import { loadSettings, saveSettings } from '../utils/settings'
import { DarkTheme, LightTheme } from '../config'

export type UIlanguage = keyof Types.MultiLingualText
export type TransliterationLanguage = keyof Types.MultiLingualText | 'off'

const INITIAL_VALUES = {
    currentDate: undefined as Date | undefined,
    fontSize: 10 as number,
    darkMode: false as boolean,
    uiLanguage: 'english' as UIlanguage,
    copticTransliterationLanguage: 'coptic_english' as TransliterationLanguage,
    churchSaints: [] as string[],
}
export type Settings = typeof INITIAL_VALUES
export type SettingsProperty = keyof Settings

type SettingsContext = { settings: Settings; updateSettings: (settings: Partial<Settings>) => void }
const SettingsContext = createContext<SettingsContext>({ settings: {} as Settings, updateSettings: () => {} })

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>(INITIAL_VALUES)
    useEffect(() => {
        const init = async () => {
            const storedSettings = (await loadSettings()) as Settings | undefined
            if (storedSettings) setSettings(storedSettings)
        }
        init()
    }, [])

    const updateSettings = (newSettings: Partial<Settings>) => {
        const updatedSettings = { ...settings, ...newSettings }
        setSettings(updatedSettings)
        saveSettings(updatedSettings)
    }

    return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>
}

export const SettingsConsumer = SettingsContext.Consumer

export const useSettings = () => {
    const context = useContext(SettingsContext)
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }

    const { settings, updateSettings } = context
    return [settings, updateSettings] as const
}

export const useZoomMultiplier = () => {
    const [{ fontSize }] = useSettings()
    return fontSize / 10
}

export const useCurrentDate = () => {
    const [{ currentDate }] = useSettings()
    return currentDate || new Date()
}

export const useTheme = () => {
    const [{ darkMode }] = useSettings()
    return darkMode ? DarkTheme : LightTheme
}

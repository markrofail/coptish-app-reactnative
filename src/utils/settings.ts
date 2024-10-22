import AsyncStorage from '@react-native-async-storage/async-storage'
import superjson from 'superjson'

const SETTINGS_STORAGE_KEY = '@settings'

export const loadSettings = async () => {
    try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY)
        if (storedSettings) return superjson.parse(storedSettings)
    } catch (error) {
        console.error(error)
    }
}

export const saveSettings = async (settings: any) => {
    try {
        const serializedSettings = superjson.stringify(settings)
        await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, serializedSettings)
    } catch (error) {
        console.error(error)
    }
}

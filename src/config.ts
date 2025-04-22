import { DefaultTheme as DefaultNavigationTheme, DarkTheme as DarkNavigationTheme } from '@react-navigation/native'
import { adaptNavigationTheme, MD3LightTheme, MD3DarkTheme } from 'react-native-paper'

export const LightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: 'black',
        primaryContainer: 'white',
    },
}

export const DarkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: 'white',
        primaryContainer: 'black',
    },
}

export const { LightTheme: NavigationLightTheme, DarkTheme: NavigationDarkTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultNavigationTheme,
    reactNavigationDark: DarkNavigationTheme,
    materialDark: DarkTheme,
    materialLight: LightTheme,
})

export const DEBUG = true

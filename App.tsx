import 'react-native-gesture-handler'

import React, { useEffect, useState } from 'react'
import { PaperProvider, Snackbar } from 'react-native-paper'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar'
import { en, registerTranslation } from 'react-native-paper-dates'
import { useFonts } from 'expo-font'
import { NotoSerif_400Regular, NotoSerif_700Bold } from '@expo-google-fonts/noto-serif'
import { NotoNaskhArabic_400Regular, NotoNaskhArabic_700Bold } from '@expo-google-fonts/noto-naskh-arabic'
import { clearAssets, initAssets, treeAssets } from './src/utils/assets'
import * as Sentry from '@sentry/react-native'
import Constants from 'expo-constants'
import { Routes } from './src/routes'
import { ThemeContext } from './src/context/themeContext'
import { DarkTheme, LightTheme, NavigationDarkTheme, NavigationLightTheme } from './src/config'
import * as SplashScreen from 'expo-splash-screen'
import { SettingsProvider } from './src/hooks/useSettings'

registerTranslation('en', en)

Sentry.init({
    dsn: 'https://7d1ae3fa0da23305fc1a19051c48d0f3@o4507701629485056.ingest.de.sentry.io/4507701634793552',
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
})

function App() {
    const [fontsLoaded, error] = useFonts({
        NotoSerif_400Regular,
        NotoSerif_700Bold,
        NotoNaskhArabic_400Regular,
        NotoNaskhArabic_700Bold,
        ArialCoptic: require('./assets/fonts/ArialCoptic.ttf'),
        AvvaShenouda: require('./assets/fonts/AvvaShenouda.ttf'),
    })

    const [assetsLoaded, setAssetsLoaded] = useState(false)
    const [currentAsset, setCurrentAsset] = useState('')
    const [theme, setTheme] = useState(LightTheme)
    const toggleTheme = () => setTheme((prev) => (prev === LightTheme ? DarkTheme : LightTheme))

    useEffect(() => {
        const init = async () => {
            // await clearAssets()
            await initAssets(setCurrentAsset)
            // await treeAssets()

            setAssetsLoaded(true)
        }

        SplashScreen.preventAutoHideAsync()
        init()
    }, [])

    useEffect(() => {
        if (assetsLoaded && fontsLoaded) SplashScreen.hideAsync()
    }, [assetsLoaded, fontsLoaded])

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <PaperProvider theme={theme}>
                <SettingsProvider>
                    <NavigationContainer theme={theme === LightTheme ? NavigationLightTheme : NavigationDarkTheme}>
                        <Routes />
                        <StatusBar hidden />
                        <Snackbar visible={!!currentAsset} onDismiss={() => setCurrentAsset('')}>
                            {currentAsset}
                        </Snackbar>
                    </NavigationContainer>
                </SettingsProvider>
            </PaperProvider>
        </ThemeContext.Provider>
    )
}

const isStorybookEnabled = Constants?.expoConfig?.extra?.storybookEnabled === 'true'
export default isStorybookEnabled ? require('./.storybook').default : Sentry.wrap(App)

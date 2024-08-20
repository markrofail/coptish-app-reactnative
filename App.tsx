import 'react-native-gesture-handler'

import React, { useEffect, useState } from 'react'
import { PaperProvider, Snackbar } from 'react-native-paper'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { en, registerTranslation } from 'react-native-paper-dates'
import { useFonts } from 'expo-font'
import { NotoSerif_400Regular, NotoSerif_700Bold } from '@expo-google-fonts/noto-serif'
import { NotoNaskhArabic_400Regular, NotoNaskhArabic_700Bold } from '@expo-google-fonts/noto-naskh-arabic'
import { HomeScreen } from './src/screens/HomeScreen'
import { DebugScreen } from './src/screens/DebugScreen'
import { SplashScreen } from './src/screens/SplashScreen'
import { PrayerScreen } from './src/screens/PrayerScreen'
import { clearAssets, initAssets, treeAssets } from './src/utils/assets'
import * as Sentry from '@sentry/react-native'
import Constants from 'expo-constants'

registerTranslation('en', en)

Sentry.init({
    dsn: 'https://7d1ae3fa0da23305fc1a19051c48d0f3@o4507701629485056.ingest.de.sentry.io/4507701634793552',
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
})

const MyTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: 'black' },
}

export type RootStackParamList = {
    Home: undefined
    Prayer: { path: string }
    Debug: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

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

    useEffect(() => {
        const init = async () => {
            // await clearAssets()
            await initAssets(setCurrentAsset)
            // await treeAssets()

            setAssetsLoaded(true)
        }

        init()
    }, [])

    return (
        <PaperProvider>
            <NavigationContainer theme={MyTheme}>
                {fontsLoaded && assetsLoaded ? (
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Prayer" component={PrayerScreen} />
                        <Stack.Screen name="Debug" component={DebugScreen} options={{ headerShown: true }} />
                    </Stack.Navigator>
                ) : (
                    <SplashScreen />
                )}
                <StatusBar hidden />
                <Snackbar visible={!!currentAsset} onDismiss={() => setCurrentAsset('')}>
                    {currentAsset}
                </Snackbar>
            </NavigationContainer>
        </PaperProvider>
    )
}

const isStorybookEnabled = Constants?.expoConfig?.extra?.storybookEnabled === 'true'
export default isStorybookEnabled ? require('./.storybook').default : Sentry.wrap(App)

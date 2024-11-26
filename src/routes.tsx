import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from './screens/HomeScreen'
import { DebugScreen } from './screens/DebugScreen'
import { PrayerScreen } from './screens/PrayerScreen'
import { SettingsScreen } from './screens/SettingsScreen'

export type RootStackParamList = {
    Home: undefined
    Prayer: { path: string }
    Debug: undefined
    Settings: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export const Routes = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Prayer" component={PrayerScreen} options={{ gestureEnabled: false }} />
            <Stack.Screen name="Debug" component={DebugScreen} options={{ headerShown: true }} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
    )
}

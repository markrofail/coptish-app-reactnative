import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from './screens/HomeScreen'
import { DebugScreen } from './screens/DebugScreen'
import { PrayerScreen } from './screens/PrayerScreen'

export type RootStackParamList = {
    Home: undefined
    Prayer: { path: string }
    Debug: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export const Routes = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Prayer" component={PrayerScreen} />
            <Stack.Screen name="Debug" component={DebugScreen} options={{ headerShown: true }} />
        </Stack.Navigator>
    )
}

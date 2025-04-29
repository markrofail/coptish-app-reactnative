import React from 'react'
import { PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { LightTheme, NavigationLightTheme } from '@/src/config'

export const ThemeDecorator = (story: any) => {
    const Story = () => story()

    return (
        <PaperProvider theme={LightTheme}>
            <NavigationContainer theme={NavigationLightTheme}>
                <Story />
            </NavigationContainer>
        </PaperProvider>
    )
}

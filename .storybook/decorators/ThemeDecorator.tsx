import React, { useState } from 'react'
import { PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { ThemeContext } from '@/src/context/themeContext'
import { LightTheme } from '@/src/config'

export const ThemeDecorator = (story: any) => {
    const [theme, setTheme] = useState(LightTheme)
    const Story = () => story()

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <PaperProvider theme={theme}>
                <NavigationContainer theme={theme}>
                    <Story />
                </NavigationContainer>
            </PaperProvider>
        </ThemeContext.Provider>
    )
}

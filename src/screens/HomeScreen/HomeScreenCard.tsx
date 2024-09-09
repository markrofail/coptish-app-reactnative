import React from 'react'
import { Image, ImageSourcePropType, TouchableOpacity, View } from 'react-native'
import { Button } from 'react-native-paper'
import { scale } from 'react-native-size-matters'
import { useThemeContext } from '@/src/context/themeContext'

interface HomeScreenCardProps {
    title: string
    icon?: { light: ImageSourcePropType; dark: ImageSourcePropType }
    onPress: () => void
}

export const HomeScreenCard = ({ title, icon, onPress }: HomeScreenCardProps) => {
    const { theme } = useThemeContext()

    return (
        <TouchableOpacity onPress={onPress} style={{ padding: scale(8) }}>
            <View style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                <Image source={theme.dark ? icon?.dark : icon?.light} resizeMode="cover" style={{ width: scale(75), height: scale(75) }} />
                <Button buttonColor={theme.colors.elevation.level2} textColor={theme.colors.primary}>
                    {title}
                </Button>
            </View>
        </TouchableOpacity>
    )
}

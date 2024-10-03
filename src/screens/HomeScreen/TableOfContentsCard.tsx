import React from 'react'
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { scale } from 'react-native-size-matters'
import { useThemeContext } from '@/src/context/themeContext'

interface TableOfContentsCardProps {
    title: string
    icon?: { light: ImageSourcePropType; dark: ImageSourcePropType }
    onPress: () => void
}

export const TableOfContentsCard = ({ title, icon, onPress }: TableOfContentsCardProps) => {
    const { theme } = useThemeContext()

    return (
        <TouchableOpacity onPress={onPress} style={{ ...styles.container, backgroundColor: theme.colors.elevation.level2 }}>
            <Image source={theme.dark ? icon?.dark : icon?.light} resizeMode="cover" style={styles.icon} />
            <Text style={{ ...styles.text, color: theme.colors.primary }}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: scale(12),
        alignItems: 'center',
        borderRadius: scale(16),
        width: scale(120),
        height: scale(120),
    },
    icon: { width: scale(80), height: scale(80) },
    text: { flexShrink: 1, flexWrap: 'wrap' },
})

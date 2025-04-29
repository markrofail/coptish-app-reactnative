import React from 'react'
import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'
import { scale, verticalScale } from 'react-native-size-matters'
import { useTheme } from '@/src/hooks/useSettings'

interface TableOfContentsCardProps {
    title: string
    icon?: { light: ImageSourcePropType; dark: ImageSourcePropType }
    onPress: () => void
}

export const TableOfContentsCard = ({ title, icon, onPress }: TableOfContentsCardProps) => {
    const theme = useTheme()

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={{ ...styles.iconContainer, backgroundColor: theme.colors.elevation.level2 }}>
                <Image source={theme.dark ? icon?.dark : icon?.light} resizeMode="cover" style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
                <Text style={{ ...styles.text, color: theme.colors.primary }}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: verticalScale(6),
        width: scale(100),
        height: scale(100),
        aspectRatio: 1,
    },
    iconContainer: {
        padding: scale(12),
        alignItems: 'center',
        borderRadius: scale(16),
    },
    icon: { width: scale(60), height: scale(60) },
    textContainer: { flexDirection: 'row' },
    text: { flexShrink: 1, flexWrap: 'wrap', textAlign: 'center', textAlignVertical: 'center' },
})

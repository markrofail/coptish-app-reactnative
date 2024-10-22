import React from 'react'
import { StyleSheet, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { scale } from 'react-native-size-matters'

interface ToolbarProps {
    onSettingsPress: () => void
}

export const Toolbar = ({ onSettingsPress }: ToolbarProps) => {
    const insets = useSafeAreaInsets()
    const padding = {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: Math.max(insets.left, scale(8)),
        paddingRight: Math.max(insets.right, scale(8)),
    }

    return (
        <View style={{ ...styles.container, ...padding }}>
            <IconButton mode="contained-tonal" icon="cog" onPress={onSettingsPress} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: scale(4),
        position: 'absolute',
        right: 0,
        top: 0,
    },
})

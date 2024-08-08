import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { treeAssets } from '../utils/assets'
import { SplashScreen } from './SplashScreen'
import { useMemoAsync } from '../hooks/useMemoAsync'

export const DebugScreen = () => {
    const assets = useMemoAsync(treeAssets, [])

    const insets = useSafeAreaInsets()
    const padding = {
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 12,
        paddingLeft: insets.left + 12,
        paddingRight: insets.right + 12,
    }

    return !!assets ? (
        <ScrollView style={{ flex: 1, backgroundColor: 'black', ...padding }}>
            {assets.split('\n').map((line, i) => (
                <Text key={line + i} numberOfLines={1} style={{ color: 'white' }}>
                    {line}
                </Text>
            ))}
        </ScrollView>
    ) : (
        <SplashScreen />
    )
}

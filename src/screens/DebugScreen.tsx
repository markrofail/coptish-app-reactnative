import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { treeAssets } from '../utils/assets'
import { SplashScreen } from './SplashScreen'
import { useMemoAsync } from '../hooks/useMemoAsync'
import { Text as MyText } from '../components/Text'

export const DebugScreen = () => {
    const assets = useMemoAsync(treeAssets, [])

    const insets = useSafeAreaInsets()
    const padding = {
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 12,
        paddingLeft: insets.left + 12,
        paddingRight: insets.right + 12,
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'black', ...padding }}>
            {/* Font Debug */}
            <View style={{ marginBottom: 20 }}>
                <Text style={{ color: 'white', marginBottom: 10, fontSize: 24, fontWeight: 'bold' }}>Font Comparisons</Text>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <MyText variant="body" color="white" language="english" text="Kerie leison" fill />
                    <Text style={{ color: 'white', flex: 1 }}>Kerie leison</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <MyText variant="body" color="white" language="coptic" text="Ⲕⲩⲣⲓⲉ ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ" fill />
                    <Text style={{ color: 'white', flex: 1 }}>Ⲕⲩⲣⲓⲉ ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <MyText variant="body" color="white" language="arabic" text="يا ربُّ إرحَم" fill />
                    <Text style={{ color: 'white', flex: 1 }}>يا ربُّ إرحَم</Text>
                </View>
            </View>

            {/* Assets Debug */}
            <View>
                <Text style={{ color: 'white', marginBottom: 10, fontSize: 24, fontWeight: 'bold' }}>All Assets</Text>
                {assets ? (
                    <ScrollView>
                        {assets.split('\n').map((line, i) => (
                            <Text key={line + i} numberOfLines={1} style={{ color: 'white' }}>
                                {line}
                            </Text>
                        ))}
                    </ScrollView>
                ) : (
                    <SplashScreen />
                )}
            </View>
        </View>
    )
}

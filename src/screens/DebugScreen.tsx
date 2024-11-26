import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { treeAssets } from '../utils/assets'
import { useMemoAsync } from '../hooks/useMemoAsync'
import { Text as MyText } from '../components/Text'
import { scale, verticalScale } from 'react-native-size-matters'
import { ActivityIndicator, List, Text } from 'react-native-paper'

export const DebugScreen = () => {
    const assets = useMemoAsync(treeAssets, [])
    const { english, coptic, arabic } = TEST_TEXT

    const insets = useSafeAreaInsets()
    const padding = {
        paddingBottom: insets.bottom,
        paddingLeft: Math.max(insets.left, scale(8)),
        paddingRight: Math.max(insets.right, scale(8)),
    }

    return (
        <View style={[styles.container, padding]}>
            {/* Font Debug */}
            <List.Section>
                <List.Subheader>Font Comparisons</List.Subheader>

                <View style={styles.section}>
                    <View style={styles.fontComparisonContainer}>
                        <MyText variant="body" color="black" language="english" text={english} center fill />
                        <Text style={styles.fontComparisonText}>{english}</Text>
                    </View>

                    <View style={styles.fontComparisonContainer}>
                        <MyText variant="body" color="black" language="coptic" text={coptic} center fill />
                        <Text style={styles.fontComparisonText}>{coptic}</Text>
                    </View>

                    <View style={styles.fontComparisonContainer}>
                        <MyText variant="body" color="black" language="arabic" text={arabic} center fill />
                        <Text style={styles.fontComparisonText}>{arabic}</Text>
                    </View>
                </View>
            </List.Section>

            {/* Assets Debug */}
            <List.Section>
                <List.Subheader>All Assets</List.Subheader>

                <View style={styles.section}>
                    {!!assets ? (
                        <ScrollView>
                            {assets.split('\n').map((line, i) => (
                                <Text key={line + i} numberOfLines={1}>
                                    {line}
                                </Text>
                            ))}
                        </ScrollView>
                    ) : (
                        <ActivityIndicator size="large" />
                    )}
                </View>
            </List.Section>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        gap: verticalScale(12),
    },
    section: {
        backgroundColor: 'white',
        borderRadius: scale(8),
        padding: scale(8),
    },
    fontComparisonContainer: { flexDirection: 'row', gap: scale(6), alignItems: 'center', justifyContent: 'center' },
    fontComparisonText: { flex: 1, textAlign: 'center' },
    assetContainer: { flex: 1 },
})

const TEST_TEXT = {
    english: 'Kerie leison',
    coptic: 'Ⲕⲩⲣⲓⲉ ⲉ̀ⲗⲉⲏ̀ⲥⲟⲛ',
    arabic: 'يا ربُّ إرحَم',
}

import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootStackParamList } from '@/src/routes'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Button } from 'react-native-paper'
import { scale, verticalScale } from 'react-native-size-matters'
import { TableOfContentsCard } from './TableOfContentsCard'
import { useThemeContext } from '@/src/context/themeContext'
import { CalendarWidget } from './CalendarWidget'
import { Toolbar } from './Toolbar'
import { DEBUG } from '@/src/config'
import { useCurrentDate } from '@/src/hooks/useSettings'

const TABLE_OF_CONTENTS = [
    {
        title: 'Liturgy St Basil',
        path: 'liturgy-st-basil',
        icon: {
            dark: require('@/assets/images/liturgy-white.png'),
            light: require('@/assets/images/liturgy-black.png'),
        },
    },
    {
        title: 'Psalmody',
        path: 'psalmody',
        icon: {
            dark: require('@/assets/images/psalmody-white.png'),
            light: require('@/assets/images/psalmody-black.png'),
        },
    },
]

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Prayer'>

export const HomeScreen = () => {
    const { theme } = useThemeContext()
    const date = useCurrentDate()
    const navigation = useNavigation<NavigationProps>()

    const onSettingsPress = () => navigation.navigate('Settings')

    const insets = useSafeAreaInsets()
    const padding = {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: Math.max(insets.left, scale(8)),
        paddingRight: Math.max(insets.right, scale(8)),
    }

    return (
        <View style={{ ...styles.container, ...padding, backgroundColor: theme.colors.background }}>
            <View style={styles.logoContainer}>
                <Image source={require('@/assets/images/icon-black.png')} style={styles.logo} />
            </View>

            <View style={styles.calendarContainer}>
                <CalendarWidget date={date} occasion="annual" onPress={onSettingsPress} />
            </View>

            <View style={styles.tableOfContents}>
                {TABLE_OF_CONTENTS.map(({ title, path, icon }) => (
                    <TableOfContentsCard key={title} title={title} icon={icon} onPress={() => navigation.navigate('Prayer', { path })} />
                ))}
            </View>

            <Toolbar onSettingsPress={onSettingsPress} />

            {DEBUG && (
                <Button
                    mode="contained"
                    buttonColor={theme.colors.elevation.level2}
                    textColor={theme.colors.primary}
                    style={styles.debugButton}
                    onPress={() => navigation.navigate('Debug')}
                >
                    Debug
                </Button>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    logoContainer: { justifyContent: 'center', alignItems: 'center' },
    logo: { width: scale(120), height: undefined, aspectRatio: 1 },
    calendarContainer: { justifyContent: 'center', alignItems: 'center' },
    tableOfContents: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: scale(32),
        marginHorizontal: scale(12),
        columnGap: scale(8),
        rowGap: verticalScale(16),
    },
    debugButton: {
        position: 'absolute',
        bottom: verticalScale(24),
        left: scale(12),
        alignSelf: 'flex-start',
    },
})

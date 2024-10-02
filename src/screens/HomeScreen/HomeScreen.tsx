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
import { useSettings } from '@/src/hooks/useSettings'
import { CurrentDate } from '@/src/utils/settings'
import { Toolbar } from './Toolbar'
import { DEBUG } from '@/src/config'

const TABLE_OF_CONTENTS = [
    {
        title: 'Liturgy St Basil',
        path: 'liturgy-st-basil',
        icon: {
            dark: require('@/assets/images/LiturgyIcon-white.png'),
            light: require('@/assets/images/LiturgyIcon.png'),
        },
    },
]

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Prayer'>

export const HomeScreen = () => {
    const { theme } = useThemeContext()
    const date = useSettings(CurrentDate, new Date())
    const navigation = useNavigation<NavigationProps>()

    const insets = useSafeAreaInsets()
    const padding = {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: Math.max(insets.left, scale(8)),
        paddingRight: Math.max(insets.right, scale(8)),
    }

    return (
        <View style={{ ...styles.container, ...padding, backgroundColor: theme.colors.background }}>
            <Toolbar onSettingsPress={() => {}} />

            <View style={styles.logoContainer}>
                <Image source={require('@/assets/images/icon-black.png')} style={{ width: scale(120), height: undefined, aspectRatio: 1 }} />
            </View>

            <View style={styles.calendarContainer}>
                <CalendarWidget date={date} occasion="annual" />
            </View>

            <View style={styles.tableOfContentsContainer}>
                <View style={styles.tableOfContents}>
                    {TABLE_OF_CONTENTS.map(({ title, path, icon }) => (
                        <TableOfContentsCard key={title} title={title} icon={icon} onPress={() => navigation.navigate('Prayer', { path })} />
                    ))}
                </View>
            </View>

            <Button
                mode="contained"
                buttonColor={theme.colors.elevation.level2}
                textColor={theme.colors.primary}
                style={styles.debugButton}
                onPress={() => navigation.navigate('Debug')}
            >
                Debug
            </Button>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    logoContainer: { justifyContent: 'center', alignItems: 'center' },
    calendarContainer: { justifyContent: 'center', alignItems: 'center' },
    tableOfContentsContainer: { flex: 1 },
    tableOfContents: {
        marginTop: scale(16),
        marginLeft: scale(12),
        columnGap: scale(16),
        rowGap: verticalScale(16),
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    debugButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        display: DEBUG ? 'flex' : 'none',
        alignSelf: 'flex-start',
    },
})

import React from 'react'
import { Image, ScrollView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { RootStackParamList } from '@/src/routes'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ScaledSheet } from 'react-native-size-matters'
import { Button, Surface } from 'react-native-paper'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters'
import { HomeScreenCard } from './HomeScreenCard'
import { useThemeContext } from '@/src/context/themeContext'
import { OccasionCard } from './OccasionCard'
import { useSettings } from '@/src/hooks/useSettings'
import { CurrentDate } from '@/src/utils/settings'

const TABLE_OF_CONTENTS = [
    {
        title: 'Liturgy St Basil',
        path: 'liturgy-st-basil',
        icon: {
            dark: require('@/assets/images/LiturgyIcon-white.png'),
            light: require('@/assets/images/LiturgyIcon.png'),
        },
    }, //
]

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Prayer'>

export const HomeScreen = () => {
    const { theme } = useThemeContext()
    const date = useSettings(CurrentDate, new Date())
    const navigation = useNavigation<NavigationProps>()

    const insets = useSafeAreaInsets()
    const padding = {
        paddingTop: insets.top + scale(6),
        paddingBottom: insets.bottom + scale(6),
        paddingLeft: insets.left + verticalScale(6),
        paddingRight: insets.right + verticalScale(6),
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background, ...padding }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('@/assets/images/icon-black.png')} style={{ width: scale(100), height: undefined, aspectRatio: 1 }} />
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <OccasionCard date={date} occasion="annual" />
            </View>

            <View style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{
                        marginTop: scale(16),
                        marginLeft: scale(12),
                        columnGap: scale(16),
                        rowGap: verticalScale(16),
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}
                >
                    {TABLE_OF_CONTENTS.map(({ title, path, icon }) => (
                        <HomeScreenCard key={title} title={title} icon={icon} onPress={() => navigation.navigate('Prayer', { path })} />
                    ))}
                </ScrollView>
                <Button
                    mode="contained"
                    buttonColor={theme.colors.elevation.level2}
                    textColor={theme.colors.primary}
                    style={{ alignSelf: 'flex-start' }}
                    onPress={() => navigation.navigate('Debug')}
                >
                    Debug
                </Button>
            </View>
        </View>
    )
}

const styles = ScaledSheet.create({
    container: {
        width: '100@s', // = scale(100)
        height: '200@vs', // = verticalScale(200)
        padding: '2@msr', // = Math.round(moderateScale(2))
        margin: 5,
    },
    row: {
        padding: '10@ms0.3', // = moderateScale(10, 0.3)
        width: '50@ms', // = moderateScale(50)
        height: '30@mvs0.3', // = moderateVerticalScale(30, 0.3)
    },
})

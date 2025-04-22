import React, { useEffect, useMemo, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { PrayerDrawer } from '../PrayerDrawer'
import { useMemoAsync } from '../../hooks/useMemoAsync'
import { loadPrayer, PrayerGroup, PrayerWithId } from '../../utils/assets'
import * as Types from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/src/routes'
import { StyleSheet, View } from 'react-native'
import { scale } from 'react-native-size-matters'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { SkeletonPrayer } from '@/src/components/SkeletonPrayer'
import { PrayerScrollableList } from './PrayerList'
import { DEBUG } from '@/src/config'

const Drawer = createDrawerNavigator()

type TitleListItem = { type: 'title'; title?: Types.MultiLingualText }
type PrayerListItem = { type: 'prayer' } & PrayerWithId
export type ListItem = TitleListItem | PrayerListItem

const prayerToListItems = (prayerGroups: PrayerGroup[]): ListItem[] => {
    const items: ListItem[] = []

    for (const { metadata, prayers } of prayerGroups) {
        items.push({ type: 'title' as const, ...metadata })
        items.push(...prayers.map((prayer) => ({ type: 'prayer' as const, ...prayer })))
    }

    return items.filter(Boolean)
}

type PrayerScreenProps = NativeStackScreenProps<RootStackParamList, 'Prayer'>

export const PrayerScreen = () => {
    const { params } = useRoute<PrayerScreenProps['route']>()
    const path = params?.path

    const prayer = useMemoAsync(() => loadPrayer(path, 'annual'), [])
    const listItems = useMemo(() => (!!prayer ? prayerToListItems(prayer) : []), [prayer?.length])
    const [activeItem, setActiveItem] = useState<ListItem>()
    const outerNavigation = useNavigation<PrayerScreenProps['navigation']>()
    const activeItemId = activeItem?.type == 'prayer' ? activeItem.id : ''

    useEffect(() => {
        const firstPrayer = listItems && listItems.find((item) => item?.type === 'prayer')
        if (firstPrayer) onActiveItemChange(firstPrayer)
    }, [listItems?.length])

    useEffect(() => {
        if (DEBUG) console.log({ activeItemId })
    }, [activeItemId])

    const onActiveItemChange = (item: ListItem) => {
        if (item?.type === 'prayer') {
            setActiveItem(item)
        }
    }

    const insets = useSafeAreaInsets()
    const padding = {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: Math.max(insets.left, scale(8)),
        paddingRight: Math.max(insets.right, scale(8)),
    }

    return (
        <Drawer.Navigator
            screenOptions={{ headerShown: false }}
            drawerContent={() => (
                <PrayerDrawer
                    listItems={listItems}
                    activeItem={activeItem}
                    onActiveItemChange={onActiveItemChange}
                    onSettingsPress={() => outerNavigation.navigate('Settings')}
                />
            )}
        >
            <Drawer.Screen name="Home">
                {() => (
                    <View style={[styles.container, padding]}>
                        {listItems.length > 0 && activeItem ? (
                            <PrayerScrollableList
                                listItems={listItems.filter(({ type }) => type == 'prayer')}
                                activeItem={activeItem}
                                onActiveItemChange={onActiveItemChange}
                            />
                        ) : (
                            <SkeletonPrayer />
                        )}
                    </View>
                )}
            </Drawer.Screen>
        </Drawer.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
})

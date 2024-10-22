import React, { useCallback, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { DrawerActions } from '@react-navigation/routers'
import { useNavigation } from '@react-navigation/core'
import { useCurrentDate } from '../../hooks/useSettings'
import { ListItem } from '../PrayerScreen/PrayerScreen'
import { DrawerHeader } from './DrawerHeader'
import { DrawerListItem } from './DrawerListItem'
import { verticalScale } from 'react-native-size-matters'
import { DrawerListSkeleton } from './DrawerListSkeleton'

interface PrayerDrawerProps {
    listItems: ListItem[]
    activeItem?: ListItem
    onActiveItemChange: (item: ListItem) => void
    onSettingsPress: () => void
}

export const PrayerDrawer = ({ listItems, activeItem, onActiveItemChange, onSettingsPress }: PrayerDrawerProps) => {
    const scrollRef = useRef<FlashList<ListItem>>(null)
    const date = useCurrentDate()

    useEffect(() => {
        activeItem && scrollRef.current?.scrollToItem({ item: activeItem, animated: false })
    }, [activeItem])

    const navigation = useNavigation()
    const toggleDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer())
    const onBackPress = () => navigation.goBack()

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<ListItem>) => (
            <DrawerListItem
                index={index}
                active={item === activeItem}
                item={item}
                onPress={() => {
                    toggleDrawer()
                    onActiveItemChange(item)
                }}
            />
        ),
        [activeItem],
    )

    const insets = useSafeAreaInsets()
    const padding = {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingRight: insets.right,
        paddingLeft: insets.left,
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: 'black', ...padding }}>
                <View style={{ marginBottom: verticalScale(6) }}>
                    <DrawerHeader date={date} onBackPress={onBackPress} onSettingsPress={onSettingsPress} />
                </View>
                {listItems.length > 0 ? (
                    <FlashList
                        ref={scrollRef}
                        keyExtractor={(item, index) => `${index}-${item.title?.english.toLocaleLowerCase()}`}
                        data={listItems}
                        estimatedItemSize={50}
                        showsVerticalScrollIndicator={false}
                        renderItem={renderItem}
                        extraData={activeItem}
                    />
                ) : (
                    <DrawerListSkeleton />
                )}
            </View>
        </>
    )
}

import React, { useCallback, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { DrawerActions } from '@react-navigation/routers'
import { useNavigation } from '@react-navigation/core'
import { CurrentDate } from '../../utils/settings'
import { useToggle } from '../../hooks/useToggle'
import { SettingsModal } from '../SettingsModal'
import { useSettings } from '../../hooks/useSettings'
import { ListItem } from '../PrayerScreen/PrayerScreen'

interface PrayerDrawerProps {
    listItems: ListItem[]
    activeItem?: ListItem
    onActiveItemChange: (item: ListItem) => void
}

export const PrayerDrawer = ({ listItems, activeItem, onActiveItemChange }: PrayerDrawerProps) => {
    const ref = useRef<FlashList<ListItem>>(null)
    const date = useSettings(CurrentDate, new Date())
    const [isSettingsModalVisible, toggleSettingsModalVisible] = useToggle()

    useEffect(() => {
        activeItem && ref.current?.scrollToItem({ item: activeItem, animated: false })
    }, [activeItem])

    const navigation = useNavigation()
    const toggleDrawer = () => navigation.dispatch(DrawerActions.toggleDrawer())
    const onBackPress = () => navigation.goBack()

    const renderItem = useCallback(
        ({ item, index }: ListRenderItemInfo<ListItem>) => (
            <DrawerItem
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
        paddingLeft: insets.left + 12,
        paddingRight: insets.right + 12,
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: 'black', ...padding }}>
                <View style={{ height: 25 }} />
                <DrawerHeader date={date} onBackPress={onBackPress} onSettingsPress={toggleSettingsModalVisible} />
                <View style={{ height: 25 }} />
                <FlashList
                    ref={ref}
                    keyExtractor={({ id }, index) => `${index}-${id}`}
                    data={listItems}
                    estimatedItemSize={50}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    extraData={activeItem}
                />
            </View>
            <SettingsModal visible={isSettingsModalVisible} onDismiss={toggleSettingsModalVisible} />
        </>
    )
}

import React, { useCallback, useEffect, useRef } from 'react'
import { View } from 'react-native'
import { Button, Icon, IconButton, MD3Colors, Text, TouchableRipple } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { DrawerActions } from '@react-navigation/routers'
import { useNavigation } from '@react-navigation/core'
import { getCopticDate } from '../../utils/date'
import { Stack } from '../../components/Stack'
import { CurrentDate } from '../../utils/settings'
import { useToggle } from '../../hooks/useToggle'
import { SettingsModal } from '../SettingsModal'
import { useSettings } from '../../hooks/useSettings'
import { ListItem } from './PrayerScreen'

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

interface DrawerHeaderProps {
    date: Date
    onBackPress: () => void
    onSettingsPress: () => void
}
const DrawerHeader = ({ date, onBackPress, onSettingsPress }: DrawerHeaderProps) => {
    const { day, month, year } = getCopticDate(date)
    const copticDateStr = `${day} ${month} ${year}`

    return (
        <Stack direction="row" gap="m" centered>
            {/* Back */}
            <IconButton icon="arrow-left" iconColor={MD3Colors.neutral100} size={20} onPress={onBackPress} />

            {/* Coptic Date */}
            <Stack direction="row" gap="s" centered>
                <Icon source={'calendar'} color="white" size={20} />
                <Text style={{ color: 'white' }}>{copticDateStr}</Text>
            </Stack>

            {/* Settings */}
            <IconButton icon="cog" iconColor={MD3Colors.neutral100} size={20} onPress={onSettingsPress} />
        </Stack>
    )
}

interface DrawerItemProps {
    item: ListItem
    onPress: () => void
    index: number
    active?: boolean
}

const DrawerItem = ({ item, active, index, onPress }: DrawerItemProps) => {
    const backgroundColor = active ? 'white' : 'black'
    const textColor = active ? 'black' : 'white'

    return item?.type === 'title' ? (
        <View style={{ marginBottom: 10, marginTop: index === 0 ? 0 : 20 }}>
            {item?.title?.english && <Text style={{ textAlign: 'left', color: 'white' }}>{item?.title?.english}</Text>}
        </View>
    ) : item?.hidden !== false ? (
        <TouchableRipple onPress={onPress}>
            <View
                style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 32,
                    backgroundColor,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'row',
                    overflow: 'visible',
                }}
            >
                <View style={{ paddingLeft: 10 }}>
                    <Text style={{ fontSize: 20, textAlign: 'left', color: textColor }}>{index}</Text>
                </View>
                <View style={{ paddingLeft: 10, flexDirection: 'column', overflow: 'visible' }}>
                    {item?.title?.english && (
                        <Text style={{ textAlign: 'left', color: textColor }} numberOfLines={1} ellipsizeMode="clip">
                            {item?.title?.english}
                        </Text>
                    )}
                    {item?.title?.arabic && (
                        <Text style={{ textAlign: 'left', color: textColor }} numberOfLines={1} ellipsizeMode="clip">
                            {item?.title?.arabic}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableRipple>
    ) : null
}

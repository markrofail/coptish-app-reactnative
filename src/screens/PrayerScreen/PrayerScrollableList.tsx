import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, ListRenderItemInfo, Pressable, ScrollView, View, ViewToken } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Prayer } from '../../components/Prayer'
import { Stack } from '../../components/Stack'
import { Types } from '../../types'
import { MultiLingualText } from '../../components/MultiLingualText'
import { ListItem } from './PrayerScreen'
import { FlatList } from 'react-native-gesture-handler'
import { ListRenderItem } from '@shopify/flash-list'

interface PrayerScrollableListProps {
    listItems: ListItem[]
    activeItem?: ListItem
    onActiveItemChange: (item: ListItem) => void
}

export const PrayerScrollableList = ({ listItems, activeItem, onActiveItemChange }: PrayerScrollableListProps) => {
    const ref = useRef<FlatList>(null)
    const [visibleItem, setVisibleItem] = useState<ListItem>()

    useEffect(() => {
        if (!activeItem || activeItem === visibleItem) return
        ref.current?.scrollToItem({ item: activeItem, animated: false })
    }, [activeItem])

    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<ListItem>) =>
            item.type === 'title' ? (
                <MultiLingualText variant="heading1" text={{ english: item?.title?.english }} />
            ) : item.type === 'prayer' ? (
                <Stack spaceBelow="m">
                    <Prayer prayer={item as Types.Prayer} />
                </Stack>
            ) : null,
        [],
    )

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken<ListItem>[]; changed: ViewToken<ListItem>[] }) => {
            const firstVisibleItem = viewableItems?.[0]?.item
            if (!firstVisibleItem) return

            setVisibleItem(firstVisibleItem)
            onActiveItemChange(firstVisibleItem)
        },
        [setVisibleItem, onActiveItemChange],
    )

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            {!!listItems && (
                <FlatList //
                    ref={ref}
                    initialNumToRender={2}
                    windowSize={3}
                    data={listItems}
                    renderItem={renderItem}
                    extraData={activeItem?.type === 'prayer' && activeItem?.id}
                    onViewableItemsChanged={onViewableItemsChanged}
                    onScrollToIndexFailed={(error) => {
                        ref?.current?.scrollToOffset({ offset: error.averageItemLength * error.index, animated: false })
                        setTimeout(() => {
                            if (listItems.length !== 0) {
                                ref?.current?.scrollToIndex({ index: error.index, animated: false })
                            }
                        }, 100)
                    }}
                />
            )}
        </View>
    )
}

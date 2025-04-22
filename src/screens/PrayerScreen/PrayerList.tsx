import React, { useCallback, useEffect, useRef } from 'react'
import { Prayer } from '../../components/Prayer'
import { MultiLingualText } from '../../components/MultiLingualText'
import { ListItem } from './PrayerScreen'
import { FlashList, ListRenderItemInfo, ViewToken } from '@shopify/flash-list'

interface PrayerScrollableListProps {
    listItems: ListItem[]
    activeItem: ListItem
    onActiveItemChange: (item: ListItem) => void
}

const renderItem = ({ item }: ListRenderItemInfo<ListItem>) => {
    if (item.type === 'title' && item.title) return <MultiLingualText variant="heading1" text={item.title} />
    if (item.type === 'prayer') return <Prayer prayer={item} />
    return null
}

const _onViewableItemsChanged =
    (activeItem: ListItem, onActiveItemChange: (item: ListItem) => void) =>
    ({ viewableItems }: { viewableItems?: ViewToken[]; changed: ViewToken[] }) => {
        const item = viewableItems?.at(0)?.item
        if (!item) return

        if (item.type === 'prayer' && item !== activeItem) onActiveItemChange(item)
    }

export const PrayerScrollableList = ({ listItems, activeItem, onActiveItemChange }: PrayerScrollableListProps) => {
    const ref = useRef<FlashList<ListItem>>(null)

    useEffect(() => {
        ref.current?.scrollToItem({ item: activeItem, animated: false })
    }, [activeItem])

    const onViewableItemsChanged = useCallback(_onViewableItemsChanged(activeItem, onActiveItemChange), [activeItem, onActiveItemChange])

    return <FlashList ref={ref} data={listItems} renderItem={renderItem} onViewableItemsChanged={onViewableItemsChanged} />
}

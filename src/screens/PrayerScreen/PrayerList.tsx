import React, { useCallback, useEffect, useRef, useState } from 'react'
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

export const PrayerScrollableList = ({ listItems, activeItem, onActiveItemChange }: PrayerScrollableListProps) => {
    const ref = useRef<FlashList<ListItem>>(null)
    const [visibleItem, setVisibleItem] = useState(activeItem)

    useEffect(() => {
        if (visibleItem !== activeItem) ref.current?.scrollToItem({ item: activeItem, animated: false })
    }, [visibleItem, activeItem, onActiveItemChange, ref])

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems?: ViewToken[]; changed: ViewToken[] }) => {
            const item = viewableItems?.at(0)?.item
            if (!item || item.type !== 'prayer' || item === activeItem) return

            setVisibleItem(item)
            onActiveItemChange(item)
        },
        [activeItem, setVisibleItem, onActiveItemChange],
    )

    return <FlashList ref={ref} data={listItems} renderItem={renderItem} onViewableItemsChanged={onViewableItemsChanged} showsVerticalScrollIndicator={false} />
}

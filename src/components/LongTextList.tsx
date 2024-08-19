import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, LayoutChangeEvent, ListRenderItem, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, ViewToken } from 'react-native'
import { useThrottle } from '../hooks/useThrottle'

type ItemWithId = { id: string }

const SCREEN_HEIGHT = Dimensions.get('window').height

interface LongTextListProps<T> {
    data: T[]
    initialId?: string
    renderItem: (item: T) => ReactElement
    onActiveItemChange: (activeItem: T) => void
}

export const LongTextList = <T extends ItemWithId>({ data, initialId, renderItem, onActiveItemChange }: LongTextListProps<T>) => {
    const ref = useRef<FlatList<T>>(null)
    const [virtualList, setVirtualList] = useState<T[]>([])
    const [visibleItem, setVisibleItem] = useState<T>()
    const [scrollToId, setScrollToId] = useState<string>()

    useEffect(() => {
        if (initialId === visibleItem?.id) return

        const index = data.findIndex(({ id }) => id === initialId)
        if (index >= 0) {
            const newScrollToIndex = index > 0 ? 1 : 0

            let window = [data[index]]
            if (index > 0) window = [data[index - 1], ...window]
            if (index < data.length - 1) window.push(data[index + 1])

            setVirtualList(window)
            setScrollToId(window[newScrollToIndex]?.id)
        }
    }, [initialId])

    const onStartReached = ({ distanceFromStart }: { distanceFromStart: number }) => {
        if (!!scrollToId) return
        console.log(`[EVENT] onStartReached, distanceFromStart:${distanceFromStart}`)

        const firstItem = virtualList.at(0)
        const index = data.findIndex(({ id }) => id === firstItem?.id)
        if (index < 1) return

        const prevItem = data.at(index - 1)
        if (!prevItem) return

        // console.log(`\tloading ${prevItem.id}`)
        setVirtualList((list) => [prevItem, ...list])
    }

    const onEndReached = () => {
        if (!!scrollToId) return
        console.log('[EVENT] onEndReached')

        const lastItem = virtualList.at(-1)
        const index = data.findIndex(({ id }) => id === lastItem?.id)
        if (index < 0) return

        const nextItem = data.at(index + 1)
        if (!nextItem) return

        // console.log(`\tloading ${nextItem.id}`)
        setVirtualList((list) => [...list, nextItem])
    }

    const onViewableItemsChanged = useCallback(
        (info: { viewableItems: ViewToken<T>[]; changed: ViewToken<T>[] }) => {
            const item = info?.viewableItems?.[0]?.item
            if (!item) return

            setVisibleItem(item)
            onActiveItemChange(item)
        },
        [setVisibleItem, onActiveItemChange],
    )

    return (
        virtualList?.length > 0 && (
            <FlatList
                ref={ref}
                data={virtualList}
                keyExtractor={({ id }, index) => `${index}-${id}`}
                onContentSizeChange={(_width, _height) => {
                    if (!!scrollToId && initialId === visibleItem?.id) {
                        setScrollToId(undefined)
                        // } else if (!!scrollToId) {
                        const index = virtualList.findIndex((item) => item.id === scrollToId)
                        if (index < 0) ref.current?.scrollToIndex({ index, animated: false })
                    }
                }}
                onScrollToIndexFailed={(error) => {}}
                //     ref?.current?.scrollToOffset({ offset: error.averageItemLength * error.index, animated: false })
                //     setTimeout(() => {
                //         if (virtualList.length !== 0) {
                //             ref?.current?.scrollToIndex({ index: error.index, animated: false })
                //         }
                //     }, 100)
                // }}
                renderItem={({ item }) => renderItem(item)}
                onStartReached={onStartReached}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.25}
                onViewableItemsChanged={onViewableItemsChanged}
                maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
                removeClippedSubviews
                debug
            />
        )
    )
}

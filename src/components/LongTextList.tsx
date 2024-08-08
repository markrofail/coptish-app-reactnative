import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
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
    const [virtualList, setVirtualList] = useState<T[]>([])
    const [activeItem, setActiveItem] = useState<T>()
    const [contentHeight, setContentHeight] = useState(0)
    const [offset, setOffset] = useState(0)
    const ref = useRef<FlatList<T>>(null)

    useEffect(() => {
        if (initialId === activeItem?.id) return

        const item = data.find(({ id }) => id === initialId)
        if (!!item) setVirtualList([item])
    }, [initialId])

    const [onStartReachedLocked, setOnStartReachedLocked] = useState(false)
    const onStartReached = ({ distanceFromStart }: { distanceFromStart: number }) => {
        if (onStartReachedLocked || distanceFromStart === 0) return
        setOnStartReachedLocked(true)
        console.log(`[EVENT] onStartReached, distanceFromStart:${distanceFromStart}`)

        const firstItem = virtualList.at(0)
        const index = data.findIndex(({ id }) => id === firstItem?.id)
        if (index <= 0) {
            // setOnStartReachedLocked(false)
            return
        }

        const prevItem = data.at(index - 1)
        if (!prevItem) {
            // setOnStartReachedLocked(false)
            return
        }

        // console.log(`\tloading ${prevItem.id}`)
        setVirtualList((list) => [prevItem, ...list])
    }

    const onEndReached = () => {
        console.log('[EVENT] onEndReached')

        const lastItem = virtualList.at(-1)
        const index = data.findIndex(({ id }) => id === lastItem?.id)
        if (index < 0) return

        const nextItem = data.at(index + 1)
        if (!nextItem) return

        // console.log(`\tloading ${nextItem.id}`)
        setVirtualList((list) => [...list, nextItem])
    }

    return (
        virtualList?.length > 0 && (
            <FlatList
                ref={ref}
                decelerationRate={'fast'}
                data={virtualList}
                keyExtractor={({ id }, index) => `${index}-${id}`}
                onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                    // setOnStartReachedLocked(false)
                    const newOffset = event?.nativeEvent?.contentOffset?.y

                    if (newOffset < 0 || (0 < newOffset && newOffset < SCREEN_HEIGHT * 0.1))
                        //
                        onStartReached({ distanceFromStart: newOffset })
                    //  console.log(`[EVENT] onScroll ${JSON.stringify({ newOffset })}`)
                    // setOffset(newOffset)
                }}
                onContentSizeChange={(_width, height) => {
                    setOnStartReachedLocked(false)

                    if (contentHeight) {
                        const diff = Math.max(height - contentHeight + offset, 0)
                        console.log(`[EVENT] onContentSizeChange ${JSON.stringify({ diff, new: height, old: contentHeight })}`)
                        ref.current?.scrollToOffset({ offset: diff, animated: false })
                    }
                    setContentHeight(height)
                }}
                onLayout={(event: LayoutChangeEvent) => {
                    const newOffset = event?.nativeEvent?.layout.height
                    console.log(`[EVENT] onLayout ${JSON.stringify({ height: newOffset })}`)
                }}
                renderItem={({ item }) => renderItem(item)}
                // onStartReached={onStartReached}
                // onStartReachedThreshold={0}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.25}
                debug
                windowSize={3}
                onViewableItemsChanged={({ viewableItems }) => {
                    const firstVisibleItem = viewableItems?.[0]?.item
                    if (!firstVisibleItem) return

                    setActiveItem(firstVisibleItem)
                    onActiveItemChange(firstVisibleItem)
                }}
                maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
                // maintainVisibleContentPosition={{ minIndexForVisible: 1, autoscrollToTopThreshold: 1 }}
                removeClippedSubviews
            />
        )
    )
}

import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Prayer } from '../../components/Prayer'
import { Stack } from '../../components/Stack'
import { Types } from '../../types'
import { MultiLingualText } from '../../components/MultiLingualText'
import { ListItem } from './PrayerScreen'

const SCREEN_HEIGHT = Dimensions.get('window').height

interface PrayerPaginationListProps {
    listItems: ListItem[]
    activeItem?: ListItem
    onActiveItemChange: (item: ListItem) => void
}

export const PrayerPaginationList = ({ listItems, activeItem, onActiveItemChange }: PrayerPaginationListProps) => {
    const scrollRef = useRef<ScrollView>(null)
    const [currentOffset, setCurrentOffset] = useState<number>(0)
    const [maxOffset, setMaxOffset] = useState<number>(0)

    useEffect(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: false })
    }, [activeItem])

    const onNextPage = () => {
        // const isLastPage = currentOffset + SCREEN_HEIGHT >= maxOffset
        // if (isLastPage) {
        const activeIndex = listItems.findIndex((item) => item === activeItem)
        const nextItem = listItems[activeIndex + 1]
        onActiveItemChange(nextItem)
        // }

        // scrollRef.current?.scrollTo({ y: currentOffset + SCREEN_HEIGHT })
    }

    const onPrevPage = () => {
        // const isFirstPage = currentOffset < SCREEN_HEIGHT
        // if (isFirstPage) {
        const activeIndex = listItems.findIndex((item) => item === activeItem)
        const prevItem = listItems[activeIndex - 1]
        onActiveItemChange(prevItem)
        // }

        // scrollRef.current?.scrollTo({ y: currentOffset - SCREEN_HEIGHT })
    }

    return (
        <>
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                {!!listItems && !!activeItem && (
                    <ScrollView //
                        ref={scrollRef}
                        onContentSizeChange={(_w, h) => {
                            setCurrentOffset(0)
                            setMaxOffset(h)
                        }}
                        onScroll={({ nativeEvent: { contentOffset, contentSize } }) => {
                            setCurrentOffset(contentOffset.y)
                            setMaxOffset(contentSize.height)
                        }}
                        // scrollEnabled={false}
                        // pagingEnabled
                    >
                        {activeItem.type === 'title' ? (
                            <MultiLingualText variant="heading1" text={{ english: activeItem?.title?.english }} />
                        ) : (
                            <Stack spaceBelow="m">
                                <Prayer prayer={activeItem as Types.Prayer} />
                            </Stack>
                        )}
                    </ScrollView>
                )}
            </View>
            <Pressable
                onPress={onPrevPage} //
                style={{ position: 'absolute', top: 0, left: 0, width: '25%', height: '100%', backgroundColor: 'transparent' }}
            />
            <Pressable
                onPress={onNextPage} //
                style={{ position: 'absolute', top: 0, right: 0, width: '25%', height: '100%', backgroundColor: 'transparent' }}
            />
        </>
    )
}

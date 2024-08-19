import React, { useEffect, useRef } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { Prayer } from '../../components/Prayer'
import { Types } from '../../types'
import { MultiLingualText } from '../../components/MultiLingualText'
import { ListItem } from './PrayerScreen'
import { Button, IconButton } from 'react-native-paper'

interface PrayerPaginationListProps {
    listItems: ListItem[]
    activeItem?: ListItem
    onActiveItemChange: (item: ListItem) => void
}

export const PrayerPaginationList = ({ listItems, activeItem, onActiveItemChange }: PrayerPaginationListProps) => {
    const ref = useRef<ScrollView>(null)

    const activeIndex = listItems.findIndex((item) => item === activeItem)
    const isFirstItem = activeIndex === 0
    const isLastItem = activeIndex === listItems.length - 1

    useEffect(() => {
        ref.current?.scrollTo({ y: 0, animated: false })
    }, [activeIndex])

    const onNextPage = () => {
        const nextItem = listItems[activeIndex + 1]
        onActiveItemChange(nextItem)
    }

    const onPrevPage = () => {
        const prevItem = listItems[activeIndex - 1]
        onActiveItemChange(prevItem)
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            {!!listItems && !!activeItem && (
                <ScrollView ref={ref}>
                    {activeItem.type === 'title' ? (
                        <MultiLingualText variant="heading1" text={{ english: activeItem?.title?.english }} />
                    ) : (
                        <Prayer prayer={activeItem as Types.Prayer} />
                    )}
                </ScrollView>
            )}
            {!isFirstItem && (
                <Pressable
                    onPress={onPrevPage} //
                    style={{ position: 'absolute', top: 0, left: 0, width: '25%', height: '100%', backgroundColor: 'transparent' }}
                />
            )}
            {!isLastItem && (
                <Pressable
                    onPress={onNextPage} //
                    style={{ position: 'absolute', top: 0, right: 0, width: '25%', height: '100%', backgroundColor: 'transparent' }}
                />
            )}
        </View>
    )
}

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, View, ViewToken } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { Prayer } from '../../components/Prayer'
import { Stack } from '../../components/Stack'
import { Types } from '../../types'
import { MultiLingualText } from '../../components/MultiLingualText'
import { ListItem } from './PrayerScreen'
import { LongTextList } from '../../components/LongTextList'

const SCREEN_HEIGHT = Dimensions.get('window').height

interface PrayerLongListProps {
    listItems: ListItem[]
    activeItem?: ListItem
    onActiveItemChange: (item: ListItem) => void
}

export const PrayerLongList = ({ listItems, activeItem, onActiveItemChange }: PrayerLongListProps) => {
    const [visibleItem, setVisibleItem] = useState<ListItem>()

    const renderItem = useCallback(
        ({ type, ...props }: ListItem) =>
            type === 'title' ? (
                <MultiLingualText variant="heading1" text={{ english: props?.title?.english }} />
            ) : (
                <Stack spaceBelow="m">
                    <Prayer prayer={props as Types.Prayer} />
                </Stack>
            ),
        [],
    )

    const onViewableItemsChanged = useCallback(
        (newActiveItem: ListItem) => {
            setVisibleItem(newActiveItem)
            onActiveItemChange(newActiveItem)
        },
        [setVisibleItem, onActiveItemChange],
    )

    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <LongTextList
                data={listItems} //
                initialId={activeItem?.id}
                renderItem={renderItem}
                onActiveItemChange={onViewableItemsChanged}
            />
        </View>
    )
}

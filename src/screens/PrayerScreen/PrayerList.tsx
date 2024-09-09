import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, View, ViewToken } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list'
import { Prayer } from '../../components/Prayer'
import { Stack } from '../../components/Stack'
import * as Types from '../../types'
import { MultiLingualText } from '../../components/MultiLingualText'
import { ListItem } from './PrayerScreen'

const SCREEN_HEIGHT = Dimensions.get('window').height

interface PrayerListProps {
    listItems: ListItem[]
    activeItem?: ListItem
    onActiveItemChange: (item: ListItem) => void
}

export const PrayerList = ({ listItems, activeItem, onActiveItemChange }: PrayerListProps) => {
    const ref = useRef<FlashList<ListItem>>(null)
    const [visibleItem, setVisibleItem] = useState<ListItem>()

    useEffect(() => {
        if (!activeItem || activeItem === visibleItem) return
        ref.current?.scrollToItem({ item: activeItem, animated: false })
    }, [activeItem])

    const renderItem = useCallback(
        ({ item: { type, ...props } }: ListRenderItemInfo<ListItem>) =>
            type === 'title' ? (
                props?.title?.english && <MultiLingualText variant="heading1" text={{ english: props.title.english }} />
            ) : (
                <Stack spaceBelow="m">
                    <Prayer prayer={props as Types.Prayer} />
                </Stack>
            ),
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

    const insets = useSafeAreaInsets()
    const padding = {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left + 12,
        paddingRight: insets.right + 12,
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'black', ...padding }}>
            <FlashList
                ref={ref}
                data={listItems}
                keyExtractor={(item, index) => `${index}-${item.title?.english.toLocaleLowerCase()}`}
                onViewableItemsChanged={onViewableItemsChanged}
                renderItem={renderItem}
                estimatedItemSize={SCREEN_HEIGHT * 0.5}
                extraData={activeItem}
                overrideProps={{ windowSize: 5 }}
                showsVerticalScrollIndicator={false}
                maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            />
        </View>
    )
}

import React, { useRef, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Prayer } from '../../components/Prayer'
import { MultiLingualText } from '../../components/MultiLingualText'
import { ListItem } from './PrayerScreen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { verticalScale } from 'react-native-size-matters'
import { DEBUG } from '@/src/config'
import { SkeletonPrayer } from '@/src/components/SkeletonPrayer'

interface PrayerPaginationListProps {
    listItems: ListItem[]
    activeItem?: ListItem
    onActiveItemChange: (item: ListItem) => void
}

export const PrayerPaginationList = ({ listItems, activeItem, onActiveItemChange }: PrayerPaginationListProps) => {
    const ref = useRef<ScrollView>(null)

    const [yOffset, setYOffset] = useState(0)
    const [contentSize, setContentSize] = useState(0)
    const [moveTo, setMoveTo] = useState<'perv' | 'next'>()

    const [pageSize, setPageSize] = useState(0)
    const safePageSize = Math.ceil(pageSize * 0.95)

    const activeIndex = listItems.findIndex((item) => item === activeItem)
    const isFirstPage = yOffset <= 0
    const isLastPage = Math.ceil(yOffset + pageSize) >= contentSize

    const onNextPage = () => {
        if (isLastPage) {
            const nextItem = listItems[activeIndex + 1]
            if (nextItem) {
                setMoveTo('next')
                onActiveItemChange(nextItem)
            }
        } else {
            ref.current?.scrollTo({ y: yOffset + safePageSize })
        }
    }

    const onPrevPage = () => {
        if (isFirstPage) {
            const prevItem = listItems[activeIndex - 1]
            if (prevItem) {
                setMoveTo('perv')
                onActiveItemChange(prevItem)
            }
        } else {
            ref.current?.scrollTo({ y: yOffset - safePageSize })
        }
    }

    const insets = useSafeAreaInsets()
    const padding = {
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right + verticalScale(6),
    }

    return (
        <>
            <View style={{ ...styles.container, ...padding }}>
                {listItems.length > 0 && activeItem ? (
                    <ScrollView
                        ref={ref}
                        onContentSizeChange={(_, h) => {
                            setContentSize(h)
                            if (moveTo) {
                                if (moveTo === 'perv') ref.current?.scrollToEnd({ animated: false })
                                else ref.current?.scrollTo({ y: 0, animated: false })
                                setMoveTo(undefined)
                            }
                        }}
                        onLayout={(e) => setPageSize(e.nativeEvent.layout.height)}
                        onScroll={(e) => setYOffset(e.nativeEvent.contentOffset.y)}
                        onMomentumScrollEnd={(e) => setYOffset(e.nativeEvent.contentOffset.y)}
                        maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
                    >
                        {activeItem.type === 'title' ? (
                            activeItem?.title?.english && <MultiLingualText variant="heading1" text={{ english: activeItem.title.english }} />
                        ) : (
                            <Prayer prayer={activeItem} />
                        )}
                    </ScrollView>
                ) : (
                    <SkeletonPrayer />
                )}
            </View>

            <Pressable style={styles.leftButton} onPress={onPrevPage} />
            <Pressable style={styles.rightButton} onPress={onNextPage} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    rightButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '25%',
        height: '100%',
        backgroundColor: DEBUG ? 'rgba(0, 255, 0, 0.2)' : 'transparent',
    },
    leftButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '25%',
        height: '100%',
        backgroundColor: DEBUG ? 'rgba(255, 0, 0, 0.2)' : 'transparent',
    },
})

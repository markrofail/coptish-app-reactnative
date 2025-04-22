import React, { useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Prayer } from '../../components/Prayer'
import { MultiLingualText } from '../../components/MultiLingualText'
import { ListItem } from './PrayerScreen'
import { DEBUG } from '@/src/config'
import { BlurView } from 'expo-blur'

interface PrayerScrollableListProps {
    listItems: ListItem[]
    activeItem: ListItem
    onActiveItemChange: (item: ListItem) => void
}

export const PrayerScrollableList = ({ listItems, activeItem, onActiveItemChange }: PrayerScrollableListProps) => {
    const ref = useRef<ScrollView>(null)
    const [moveTo, setMoveTo] = useState<'perv' | 'next'>()
    const activeIndex = listItems.findIndex((item) => item === activeItem)

    const onNextPage = () => {
        const nextItem = listItems[activeIndex + 1]
        if (!nextItem) return

        setMoveTo('next')
        onActiveItemChange(nextItem)
    }

    const onPrevPage = () => {
        const prevItem = listItems[activeIndex - 1]
        if (!prevItem) return

        setMoveTo('perv')
        onActiveItemChange(prevItem)
    }

    return (
        <ScrollView
            ref={ref}
            onContentSizeChange={() => {
                if (moveTo) {
                    if (moveTo === 'perv') ref.current?.scrollToEnd({ animated: false })
                    else ref.current?.scrollTo({ y: 0, animated: false })
                    setMoveTo(undefined)
                }
            }}
        >
            <TouchableOpacity onPress={onPrevPage}>
                <BlurView intensity={100}>
                    <Text style={styles.previousButton}>Back</Text>
                </BlurView>
            </TouchableOpacity>
            {activeItem.type === 'title' ? (
                activeItem?.title?.english && <MultiLingualText variant="heading1" text={{ english: activeItem.title.english }} />
            ) : (
                <Prayer prayer={activeItem} />
            )}
            <BlurView intensity={100}>
                <TouchableOpacity onPress={onNextPage}>
                    <Text style={styles.nextButton}>Next</Text>
                </TouchableOpacity>
            </BlurView>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    previousButton: {
        flex: 1,
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 64,
    },
    nextButton: {
        flex: 1,
        backgroundColor: 'white',
        textAlign: 'center',
        fontSize: 64,
    },
})

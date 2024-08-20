import React, { useEffect, useMemo, useState } from 'react'
import { IconButton, MD3Colors } from 'react-native-paper'
import { useRoute } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { PrayerPaginationList } from './PrayerPaginationList'
import { PrayerDrawer } from '../PrayerDrawer'
import { useMemoAsync } from '../../hooks/useMemoAsync'
import { loadLiturgy } from '../../utils/assets'
import { Types } from '../../types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../App'

const Drawer = createDrawerNavigator()

type TitleListItem = { type: 'title'; title?: Types.MultiLingualText }
interface PrayerListItem extends Types.Prayer {
    type: 'prayer'
}

export type ListItem = TitleListItem | PrayerListItem

const preprocessLiturgy = (liturgy: Types.Liturgy): ListItem[] => {
    const items: ListItem[] = []

    for (const { metadata, prayers } of liturgy) {
        items.push({ type: 'title' as const, ...metadata })
        items.push(...prayers.map((prayer) => ({ type: 'prayer' as const, ...prayer })))
    }

    return items.filter(Boolean)
}

type Props = NativeStackScreenProps<RootStackParamList, 'Prayer'>

export const PrayerScreen = () => {
    const { params } = useRoute<Props['route']>()
    const path = params?.path

    const liturgy = useMemoAsync(() => loadLiturgy('annual'), [])
    const listItems = useMemo(() => liturgy && preprocessLiturgy(liturgy), [!!liturgy])

    const [activeItem, setActiveItem] = useState<ListItem>()
    const [header, setHeader] = useState('')

    useEffect(() => {
        const firstPrayer = listItems && listItems.find((item) => item?.type === 'prayer')
        if (firstPrayer) onActiveItemChange(firstPrayer)
    }, [!!listItems])

    const onActiveItemChange = (item: ListItem) => {
        if (item?.type === 'prayer') {
            setActiveItem(item)
            setHeader(item?.title?.english || '')
        }
    }

    return (
        listItems && (
            <Drawer.Navigator
                screenOptions={({ navigation }) => ({
                    headerTitle: header,
                    headerStyle: { backgroundColor: 'black' },
                    headerTitleStyle: { color: 'white' },
                    headerShadowVisible: false,
                    headerLeft: () => <IconButton icon="menu" iconColor={MD3Colors.neutral100} size={20} onPress={navigation.toggleDrawer} />,
                })}
                drawerContent={() => (
                    <PrayerDrawer //
                        listItems={listItems}
                        activeItem={activeItem}
                        onActiveItemChange={onActiveItemChange}
                    />
                )}
            >
                <Drawer.Screen name="Home">
                    {() => (
                        <PrayerPaginationList //
                            listItems={listItems.filter(({ type }) => type == 'prayer')}
                            activeItem={activeItem}
                            onActiveItemChange={onActiveItemChange}
                        />
                    )}
                </Drawer.Screen>
            </Drawer.Navigator>
        )
    )
}

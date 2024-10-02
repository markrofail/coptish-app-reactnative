import React from 'react'
import { View } from 'react-native'
import { Text, TouchableRipple } from 'react-native-paper'
import { ListItem } from '../PrayerScreen'
import { scale, verticalScale } from 'react-native-size-matters'

interface DrawerListItemProps {
    item: ListItem
    onPress: () => void
    index: number
    active?: boolean
}

export const DrawerListItem = (props: DrawerListItemProps) => {
    if (!props.item.title) return <></>
    return props.item?.type === 'title' ? <TitleDrawerItem {...props} /> : <PrayerDrawerItem {...props} />
}

const TitleDrawerItem = ({ item, index }: DrawerListItemProps) => (
    <View style={{ marginBottom: 10, marginTop: index === 0 ? 0 : 20 }}>
        {item?.title?.english && <Text style={{ textAlign: 'left', color: 'white' }}>{item?.title?.english}</Text>}
    </View>
)

const PrayerDrawerItem = ({ item, active, index, onPress }: DrawerListItemProps) => {
    const backgroundColor = active ? 'white' : 'black'
    const textColor = active ? 'black' : 'white'

    return (
        <TouchableRipple onPress={onPress}>
            <View
                style={{
                    width: '100%',
                    paddingTop: verticalScale(8),
                    paddingBottom: verticalScale(8),
                    borderRadius: scale(32),
                    backgroundColor,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'row',
                    overflow: 'visible',
                }}
            >
                <View style={{ paddingLeft: verticalScale(8) }}>
                    <Text style={{ fontSize: 20, textAlign: 'left', color: textColor }}>{index}</Text>
                </View>
                <View style={{ paddingLeft: verticalScale(8), flexDirection: 'column', overflow: 'visible' }}>
                    {item?.title?.english && (
                        <Text style={{ textAlign: 'left', color: textColor }} numberOfLines={1} ellipsizeMode="clip">
                            {item?.title?.english}
                        </Text>
                    )}
                    {item?.title?.arabic && (
                        <Text style={{ textAlign: 'left', color: textColor }} numberOfLines={1} ellipsizeMode="clip">
                            {item?.title?.arabic}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableRipple>
    )
}

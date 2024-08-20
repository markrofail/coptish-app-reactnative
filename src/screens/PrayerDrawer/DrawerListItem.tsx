import React from 'react'
import { View } from 'react-native'
import { Text, TouchableRipple } from 'react-native-paper'
import { ListItem } from '../PrayerScreen'

interface DrawerListItemProps {
    item: ListItem
    onPress: () => void
    index: number
    active?: boolean
}

export const DrawerListItem = ({ item, active, index, onPress }: DrawerListItemProps) => {
    const backgroundColor = active ? 'white' : 'black'
    const textColor = active ? 'black' : 'white'

    return item?.type === 'title' ? (
        <View style={{ marginBottom: 10, marginTop: index === 0 ? 0 : 20 }}>
            {item?.title?.english && <Text style={{ textAlign: 'left', color: 'white' }}>{item?.title?.english}</Text>}
        </View>
    ) : item?.hidden !== false ? (
        <TouchableRipple onPress={onPress}>
            <View
                style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 32,
                    backgroundColor,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexDirection: 'row',
                    overflow: 'visible',
                }}
            >
                <View style={{ paddingLeft: 10 }}>
                    <Text style={{ fontSize: 20, textAlign: 'left', color: textColor }}>{index}</Text>
                </View>
                <View style={{ paddingLeft: 10, flexDirection: 'column', overflow: 'visible' }}>
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
    ) : null
}
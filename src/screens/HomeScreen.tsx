import React from 'react'
import { Image, ScrollView, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Button, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const TABLE_OF_CONTENTS = [
    { title: 'Liturgy St Basil', path: 'liturgy-st-basil' }, //
]

export const HomeScreen = () => {
    const navigation = useNavigation()

    const insets = useSafeAreaInsets()
    const padding = {
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 12,
        paddingLeft: insets.left + 12,
        paddingRight: insets.right + 12,
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'black', ...padding }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../assets/images/icon-white.png')} style={{ width: '25%', height: undefined, aspectRatio: 1 }} />
            </View>
            <View style={{ flex: 1 }}>
                <Text variant="headlineSmall" style={{ color: 'white', marginBottom: 25 }}>
                    Table of Content
                </Text>
                <ScrollView contentContainerStyle={{ paddingLeft: 25 }}>
                    {TABLE_OF_CONTENTS.map(({ title, path }) => (
                        <Button
                            key={title}
                            mode="contained"
                            buttonColor="white"
                            textColor="black"
                            style={{ alignSelf: 'flex-start', margin: 5 }}
                            onPress={() => navigation.navigate('Prayer', { path })}
                        >
                            <Text>{title}</Text>
                        </Button>
                    ))}
                    {/* <Button
                        mode="contained"
                        buttonColor="white"
                        textColor="black"
                        style={{ alignSelf: 'flex-start', margin: 5 }}
                        onPress={() => navigation.navigate('Debug')}
                    >
                        <Text>Debug</Text>
                    </Button> */}
                </ScrollView>
            </View>
        </View>
    )
}

import React from 'react'
import { View, Text } from 'react-native'
import Slider from '@react-native-community/slider'

interface FontSizeFieldProps {
    value: number
    onChange: (value: number) => void
}

export const FontSizeField = ({ value, onChange }: FontSizeFieldProps) => {
    return (
        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', color: 'white' }}>Font Size</Text>

            <Slider //
                style={{ width: '50%', height: 10 }}
                minimumValue={6}
                maximumValue={30}
                step={1}
                minimumTrackTintColor="white"
                maximumTrackTintColor="#6e6e6e"
                value={value}
                onValueChange={onChange}
            />

            <Text style={{ color: 'white' }}>{value}pt</Text>
        </View>
    )
}

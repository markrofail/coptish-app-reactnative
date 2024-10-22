import React from 'react'
import { View, StyleSheet } from 'react-native'
import Slider, { SliderProps } from '@react-native-community/slider'
import { Text } from 'react-native-paper'

interface RangeFieldProps {
    value: number
    onChange: (value: number) => void
    options: SliderProps
}

type RangeFieldInputProps = RangeFieldProps
export const RangeFieldInput = ({ value, onChange, options }: RangeFieldInputProps) => {
    return (
        <View style={styles.container}>
            <Slider style={styles.slider} value={value} onValueChange={onChange} {...options} />
        </View>
    )
}

type RangeFieldPreviewProps = Pick<RangeFieldProps, 'value'> & { units: string }
export const RangeFieldPreview = ({ value, units }: RangeFieldPreviewProps) => (
    <Text>
        {value}
        {units}
    </Text>
)

export const RangeField = { Input: RangeFieldInput, Preview: RangeFieldPreview }

const styles = StyleSheet.create({
    container: { justifyContent: 'flex-end', flexDirection: 'row' },
    slider: { width: '60%' },
})

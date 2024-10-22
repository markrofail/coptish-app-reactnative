import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Chip, Text } from 'react-native-paper'
import { getCopticDate, getGeorgianDate } from '../../utils/date'
import DateTimePicker from '@react-native-community/datetimepicker'
import { verticalScale } from 'react-native-size-matters'

interface DateFieldProps {
    value?: Date
    onChange: (value?: Date) => void
}

type DateFieldInputProps = DateFieldProps
const DateFieldInput = ({ value, onChange }: DateFieldInputProps) => {
    const valueOrTodaysDate = value || new Date()

    return (
        <DateTimePicker //
            value={valueOrTodaysDate}
            mode={'date'}
            onChange={(_, selectedDate) => onChange(selectedDate)}
        />
    )
}

type DateFieldPreviewProps = DateFieldProps
const DateFieldPreview = ({ value, onChange }: DateFieldPreviewProps) => {
    const isDifferent = value && !isNaN(value.getTime()) && getGeorgianDate(value, 'dd-mm') !== getGeorgianDate(new Date(), 'dd-mm')
    const valueOrTodaysDate = isDifferent ? value : new Date()
    const dateStr = getCopticDate(valueOrTodaysDate, 'dd-mm')

    const onClear = () => onChange(undefined)

    return !isDifferent ? (
        <Text>{dateStr}</Text>
    ) : (
        <View style={styles.dateChip}>
            <Chip onClose={onClear} compact>
                <Text variant="bodySmall">{dateStr}</Text>
            </Chip>
        </View>
    )
}

export const DateField = { Input: DateFieldInput, Preview: DateFieldPreview }

const styles = StyleSheet.create({
    dateChip: { paddingTop: verticalScale(6) },
})

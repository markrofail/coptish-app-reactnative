import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import { IconButton, MD3Colors } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import { useToggle } from '../../../hooks/useToggle'
import { getCopticDate, getGeorgianDate } from '../../../utils/date'

const HOUR_IN_MS = 60 * 60 * 1000
const roundToHour = (date: Date) => new Date(Math.round(date.getTime() / HOUR_IN_MS) * HOUR_IN_MS)

interface CurrentDateFieldProps {
    value?: Date
    onChange: (value?: Date) => void
}
export const CurrentDateField = ({ value, onChange }: CurrentDateFieldProps) => {
    const [isVisible, toggleIsVisible] = useToggle()
    const roundedValue = value && roundToHour(value)
    const todayDate = useMemo(() => new Date(), [])
    const isDifferent = useMemo(() => roundedValue && getGeorgianDate(roundedValue, 'dd-mm') !== getGeorgianDate(new Date(), 'dd-mm'), [roundedValue])

    const onSave = ({ date }: { date: CalendarDate }) => {
        if (isDifferent) onChange(roundToHour(new Date(`${date}`)))
        else onClear()

        toggleIsVisible()
    }
    const onClear = () => onChange()

    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 5 }}>Date</Text>
                {roundedValue && !isNaN(roundedValue.getTime()) && isDifferent ? (
                    <Text style={{ color: 'yellow' }}>
                        {getGeorgianDate(roundedValue, 'dd-mm')} | {getCopticDate(roundedValue, 'dd-mm')}
                    </Text>
                ) : (
                    <Text style={{ color: 'white' }}>
                        {getGeorgianDate(todayDate, 'dd-mm')} | {getCopticDate(todayDate, 'dd-mm')}
                    </Text>
                )}

                {roundedValue && !isNaN(roundedValue.getTime()) && isDifferent ? (
                    <IconButton icon="close" iconColor={MD3Colors.neutral100} size={20} onPress={onClear} />
                ) : (
                    <IconButton icon="calendar" iconColor={MD3Colors.neutral100} size={20} onPress={toggleIsVisible} />
                )}
            </View>

            <DatePickerModal //
                locale="en"
                mode="single"
                visible={isVisible}
                onDismiss={toggleIsVisible}
                date={value}
                onConfirm={onSave}
                animationType="fade"
            />
        </>
    )
}

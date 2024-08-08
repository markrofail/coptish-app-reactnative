import React from 'react'
import { View, Text } from 'react-native'
import { IconButton, MD3Colors } from 'react-native-paper'
import { DatePickerModal } from 'react-native-paper-dates'
import { CalendarDate } from 'react-native-paper-dates/lib/typescript/Date/Calendar'
import { useToggle } from '../../../hooks/useToggle'
import { getCopticDate, getIsoGeorgianDate } from '../../../utils/date'

const HOUR_IN_MS = 60 * 60 * 1000
const roundToHour = (date: Date) => new Date(Math.round(date.getTime() / HOUR_IN_MS) * HOUR_IN_MS)

interface CurrentDateFieldProps {
    value?: Date
    onChange: (value?: Date) => void
}
export const CurrentDateField = ({ value, onChange }: CurrentDateFieldProps) => {
    const [isVisible, toggleIsVisible] = useToggle()

    const georgianDate = (date: Date) => {
        const formatter = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long' })
        return formatter.format(date)
    }
    const copticDate = (date: Date) => {
        const copticDate = getCopticDate(date)
        return `${copticDate?.day} ${copticDate?.month}`
    }

    const previewDate = (date: Date) => `${georgianDate(date)} / ${copticDate(date)}`

    const onSave = ({ date }: { date: CalendarDate }) => {
        date = roundToHour(new Date(`${date}`))
        if (date && getIsoGeorgianDate(date) === getIsoGeorgianDate(new Date())) clearValue()
        else onChange(date)

        toggleIsVisible()
    }

    const clearValue = () => onChange()

    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 5 }}>Date</Text>
                {value && !isNaN(value) ? (
                    <Text style={{ color: 'yellow' }}>{previewDate(value)}</Text>
                ) : (
                    <Text style={{ color: 'white' }}>{previewDate(new Date())}</Text>
                )}

                {value && !isNaN(value) ? (
                    <IconButton icon="close" iconColor={MD3Colors.neutral100} size={20} onPress={clearValue} />
                ) : (
                    <IconButton icon="calendar" iconColor={MD3Colors.neutral100} size={20} onPress={toggleIsVisible} />
                )}
            </View>

            <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                <DatePickerModal //
                    locale="en"
                    mode="single"
                    visible={isVisible}
                    onDismiss={toggleIsVisible}
                    date={value}
                    onConfirm={onSave}
                    animationType="fade"
                />
            </View>
        </>
    )
}

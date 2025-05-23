import * as Types from '../../types'
import { getCopticDate, getGeorgianDate } from '@/src/utils/date'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Icon, Surface, Text } from 'react-native-paper'
import { scale } from 'react-native-size-matters'
import { useTheme } from '@/src/hooks/useSettings'

interface CalendarWidgetProps {
    date: Date
    occasion?: Types.Occasion
    onPress?: () => void
}

export const CalendarWidget = ({ date, occasion, onPress }: CalendarWidgetProps) => {
    const theme = useTheme()
    const copticDate = getCopticDate(date, 'dd-mm')
    const georgianDate = getGeorgianDate(date, 'dd-mm')
    const capitalizedOccasion = occasion && occasion.charAt(0).toUpperCase() + occasion.slice(1)

    return (
        <TouchableOpacity onPress={onPress}>
            <Surface style={styles.container} mode="flat" elevation={2}>
                <Icon source={'calendar'} color={theme.colors.primary} size={20} />
                <Text style={{ color: theme.colors.primary }}>
                    {georgianDate} | {copticDate} | {capitalizedOccasion}
                </Text>
            </Surface>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: scale(6),
        borderRadius: scale(8),
        gap: scale(4),
    },
})

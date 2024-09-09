import { useThemeContext } from '@/src/context/themeContext'
import * as Types from '../../types'
import { getCopticDate, getGeorgianDate } from '@/src/utils/date'
import { View } from 'react-native'
import { Icon, Surface, Text } from 'react-native-paper'
import { scale } from 'react-native-size-matters'

interface OccasionCardProps {
    date: Date
    occasion?: Types.Occasion
}

export const OccasionCard = ({ date, occasion }: OccasionCardProps) => {
    const { theme } = useThemeContext()
    const copticDate = getCopticDate(date, 'dd-mm')
    const georgianDate = getGeorgianDate(date, 'dd-mm')

    return (
        <Surface
            mode="flat"
            elevation={2}
            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: scale(6), borderRadius: scale(8), gap: scale(4) }}
        >
            <Icon source={'calendar'} color={theme.colors.primary} size={20} />
            <Text style={{ color: theme.colors.primary }}>{georgianDate} |</Text>
            <Text style={{ color: theme.colors.primary }}>{copticDate} |</Text>
            <Text style={{ color: theme.colors.primary, textTransform: 'capitalize' }}>{occasion}</Text>
        </Surface>
    )
}

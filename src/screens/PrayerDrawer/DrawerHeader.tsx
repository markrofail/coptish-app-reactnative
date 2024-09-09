import React from 'react'
import { Icon, IconButton, MD3Colors, Text } from 'react-native-paper'
import { Stack } from '../../components/Stack'
import { getCopticDate } from '../../utils/date'

interface DrawerHeaderProps {
    date: Date
    onBackPress: () => void
    onSettingsPress: () => void
}
export const DrawerHeader = ({ date, onBackPress, onSettingsPress }: DrawerHeaderProps) => {
    const copticDate = getCopticDate(date, 'dd-mm')

    return (
        <Stack direction="row" gap="m" centered>
            {/* Back */}
            <IconButton icon="arrow-left" iconColor={MD3Colors.neutral100} size={20} onPress={onBackPress} />

            {/* Coptic Date */}
            <Stack direction="row" gap="s" centered>
                <Icon source={'calendar'} color="white" size={20} />
                <Text style={{ color: 'white' }}>{copticDate}</Text>
            </Stack>

            {/* Settings */}
            <IconButton icon="cog" iconColor={MD3Colors.neutral100} size={20} onPress={onSettingsPress} />
        </Stack>
    )
}

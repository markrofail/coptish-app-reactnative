import { useThemeContext } from '@/src/context/themeContext'
import * as Types from '../../types'
import { getCopticDate, getGeorgianDate } from '@/src/utils/date'
import { Image, View } from 'react-native'
import { Icon, IconButton, Surface, Text } from 'react-native-paper'
import { scale } from 'react-native-size-matters'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface ToolbarProps {
    onSettingsPress: () => void
}

export const Toolbar = ({ onSettingsPress }: ToolbarProps) => {
    const { theme } = useThemeContext()

    return (
        <Surface
            mode="flat"
            elevation={0}
            style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                borderRadius: scale(16),
                gap: scale(4),
                width: '100%',
            }}
        >
            <View style={{ justifyContent: 'center', alignItems: 'flex-end', gap: scale(4) }}>
                <IconButton icon="cog" onPress={onSettingsPress} style={{ backgroundColor: theme.colors.elevation.level2 }} />
                {/* <Icon source={'cog'} color={theme.colors.primary} size={20} /> */}
            </View>
        </Surface>
    )
}

import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { HomeScreenCard } from '../HomeScreenCard'
import { ThemeDecorator } from '@/.storybook/decorators/ThemeDecorator'
import { useThemeContext } from '@/src/context/themeContext'

type Story = StoryObj<typeof meta>
const meta: Meta<typeof HomeScreenCard> = {
    component: HomeScreenCard,
    title: 'HomeScreen/Card',
    decorators: [ThemeDecorator],
    render: (props: any) => {
        const { theme } = useThemeContext()

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <HomeScreenCard {...props} />
            </View>
        )
    },
}

export const Basic: Story = {
    args: {
        title: 'Liturgy St Basil', //
        icon: require('@/assets/images/LiturgyIcon.png'),
        onPress: () => {},
    },
}
export default meta

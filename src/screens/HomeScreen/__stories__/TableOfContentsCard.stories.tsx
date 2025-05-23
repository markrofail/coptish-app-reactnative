import type { Meta, StoryObj } from '@storybook/react'
import { View } from 'react-native'
import { TableOfContentsCard } from '../TableOfContentsCard'
import { ThemeDecorator } from '@/.storybook/decorators/ThemeDecorator'
import { useTheme } from '@/src/hooks/useSettings'

type Story = StoryObj<typeof meta>
const meta: Meta<typeof TableOfContentsCard> = {
    component: TableOfContentsCard,
    title: 'HomeScreen/Card',
    decorators: [ThemeDecorator],
    render: (props: any) => {
        const theme = useTheme()

        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <TableOfContentsCard {...props} />
            </View>
        )
    },
}

export const Basic: Story = {
    args: {
        title: 'Liturgy St Basil', //
        icon: require('@/assets/images/liturgy-black.png'),
        onPress: () => {},
    },
}
export default meta

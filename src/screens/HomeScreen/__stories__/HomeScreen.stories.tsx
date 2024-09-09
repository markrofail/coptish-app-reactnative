import type { Meta, StoryObj } from '@storybook/react'
import { NavigationDecorator } from '@/.storybook/decorators/StoryNavigator'
import { HomeScreen } from '../HomeScreen'

type Story = StoryObj<typeof meta>
const meta: Meta<typeof HomeScreen> = {
    component: HomeScreen,
    decorators: [NavigationDecorator],
    title: 'HomeScreen',
}

export const Basic: Story = {}
export default meta

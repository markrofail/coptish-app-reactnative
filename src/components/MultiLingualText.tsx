import React from 'react'
import { Language, Text, TextProps } from './Text'
import { Stack, StackProps } from './Stack'
import { Types } from '../types'

interface MultiLingualTextProps extends Pick<TextProps, 'variant' | 'color' | 'inverse'>, Pick<StackProps, 'gap' | 'direction' | 'centered'> {
    text: Types.MultiLingualText
}

export const MultiLingualText = ({ text, gap, direction, centered, variant, color, inverse }: MultiLingualTextProps) => {
    const stackProps = { gap, centered, direction: direction ?? 'row' }
    const textProps = { variant, color, inverse }
    return (
        <Stack {...stackProps}>
            {Object.entries(text).map(([key, value]) => (
                <Text {...textProps} key={key} language={key as Language} text={value} fill />
            ))}
        </Stack>
    )
}

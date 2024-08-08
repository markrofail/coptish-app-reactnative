import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { ZoomMultiplier } from '../utils/settings'
import { useSettings } from '../hooks/useSettings'

export type Spacing = 'xs' | 's' | 'm' | 'l' | 'xl'
export type Direction = 'row' | 'column'

export interface StackProps {
    spaceAbove?: Spacing
    spaceBelow?: Spacing
    gap?: Spacing
    direction?: Direction
    centered?: boolean
    children: ReactNode
}

export const Stack = ({ spaceAbove, spaceBelow, gap, direction, centered, children }: StackProps) => {
    const zoomMultiplier = useSettings(ZoomMultiplier, 1)
    const styles = {
        ...spaceAboveStyles(zoomMultiplier)[spaceAbove ?? 'none'],
        ...spaceBelowStyles(zoomMultiplier)[spaceBelow ?? 'none'],
        ...flexStyles[direction ?? 'column'],
        ...gapStyles(zoomMultiplier)[gap ?? 'none'],
        justifyContent: centered ? ('center' as const) : undefined,
        alignItems: centered ? ('center' as const) : undefined,
    }

    return <View style={styles}>{children}</View>
}

const gapStyles = (zoomMultiplier: number) =>
    StyleSheet.create({
        none: {},
        xs: { gap: 4 * zoomMultiplier },
        s: { gap: 8 * zoomMultiplier },
        m: { gap: 16 * zoomMultiplier },
        l: { gap: 24 * zoomMultiplier },
        xl: { gap: 32 * zoomMultiplier },
    })

const spaceBelowStyles = (zoomMultiplier: number) =>
    StyleSheet.create({
        none: {},
        xs: { marginBottom: 4 * zoomMultiplier },
        s: { marginBottom: 8 * zoomMultiplier },
        m: { marginBottom: 16 * zoomMultiplier },
        l: { marginBottom: 24 * zoomMultiplier },
        xl: { marginBottom: 32 * zoomMultiplier },
    })

const spaceAboveStyles = (zoomMultiplier: number) =>
    StyleSheet.create({
        none: {},
        xs: { marginTop: 4 * zoomMultiplier },
        s: { marginTop: 8 * zoomMultiplier },
        m: { marginTop: 16 * zoomMultiplier },
        l: { marginTop: 24 * zoomMultiplier },
        xl: { marginTop: 32 * zoomMultiplier },
    })

const flexStyles = StyleSheet.create({
    row: { flexDirection: 'row' },
    column: { flexDirection: 'column' },
})

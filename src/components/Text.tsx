import React from 'react'
import { StyleSheet, Text as TextBase, View } from 'react-native'
import * as Types from '../types'
import { useZoomMultiplier } from '../hooks/useSettings'

type Variant = 'title' | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6' | 'body'
export type Language = keyof Types.MultiLingualText

export interface TextProps {
    language?: Language
    variant: Variant
    text?: string
    fill?: boolean
    color?: string
    center?: boolean
    inverse?: boolean
}

export const Text = ({ fill, center, language, variant, color, inverse, text }: TextProps) => {
    const zoomMultiplier = useZoomMultiplier()

    const styles: Record<string, any> = {
        color: color ?? (inverse ? 'black' : 'white'),
        textAlign: center ? ('center' as const) : undefined,
        ...languageStyles[language ?? 'english'],
        ...variantStyles(zoomMultiplier)[variant],
        flex: fill ? 1 : undefined,
    }
    if (!!color) styles.color = color

    // if (language === 'arabic') {
    //     styles['fontSize'] = (styles['fontSize'] || 0) + 4
    //     styles['lineHeight'] = (styles['lineHeight'] || 0) + 4
    // }
    // if (language === 'coptic') {
    //     styles['fontSize'] = (styles['fontSize'] || 0) + 6
    // }

    return !!text && <TextBase style={{ ...styles }}>{text}</TextBase>
}

const languageStyles = StyleSheet.create({
    english: { fontFamily: 'NotoSerif_400Regular' },
    coptic: { fontFamily: 'AvvaShenouda' },
    coptic_english: { fontFamily: 'NotoSerif_400Regular' },
    arabic: { fontFamily: 'NotoNaskhArabic_400Regular', alignSelf: 'flex-start', writingDirection: 'rtl', textAlign: 'right' },
    coptic_arabic: { fontFamily: 'NotoNaskhArabic_400Regular', alignSelf: 'flex-start', writingDirection: 'rtl', textAlign: 'right' },
})

const variantStyles = (zoomMultiplier: number) =>
    StyleSheet.create({
        title: { fontWeight: 'bold', fontSize: 42 * zoomMultiplier },
        heading1: { fontWeight: 'bold', fontSize: 32.0 * zoomMultiplier },
        heading2: { fontWeight: 'bold', fontSize: 24.0 * zoomMultiplier },
        heading3: { fontWeight: 'bold', fontSize: 18.72 * zoomMultiplier },
        heading4: { fontWeight: 'bold', fontSize: 16.0 * zoomMultiplier },
        heading5: { fontWeight: 'bold', fontSize: 13.28 * zoomMultiplier },
        heading6: { fontWeight: 'bold', fontSize: 10.72 * zoomMultiplier },
        body: { fontWeight: 'normal', fontSize: 12 * zoomMultiplier },
        menu: { fontWeight: 'normal', fontSize: 8 * zoomMultiplier },
        pageHeader: { fontWeight: 'normal', fontSize: 8 * zoomMultiplier },

        // title: {
        //     fontWeight: 'bold',
        //     textAlign: 'center',
        //     fontSize: 36 * zoomMultiplier,
        //     lineHeight: 42 * zoomMultiplier,
        // },
        heading: {
            textAlign: 'center',
            fontSize: 28 * zoomMultiplier,
            lineHeight: 30 * zoomMultiplier,
        },
        // body: {
        //     fontSize: 18 * zoomMultiplier,
        //     lineHeight: 26 * zoomMultiplier,
        // },
        date: {},
        menuEntry: {
            writingDirection: 'ltr',
            textAlign: 'left',
        },
        menuEntryIndex: {
            fontSize: 20,
        },
    })

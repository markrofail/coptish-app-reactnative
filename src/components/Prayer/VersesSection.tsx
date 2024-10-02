import React from 'react'
import * as Types from '../../types'
import { Stack } from '../Stack'
import { Text } from '../Text'
import { MultiLingualText } from '../MultiLingualText'

type Speaker = NonNullable<Types.VersesSection['speaker']>
const SPEAKER_LABEL_MAP: Record<Speaker, Types.MultiLingualText & { color: string }> = {
    priest: { english: 'Priest', arabic: 'الكاهن', coptic: 'Ⲡⲓⲟⲩⲏⲃ', color: '#ff4000' },
    deacon: { english: 'Deacon', arabic: 'الشماس', coptic: 'Ⲡⲓⲇⲓⲁⲕⲱⲛ', color: 'yellow' },
    reader: { english: 'Reader', arabic: 'القارئ', coptic: 'ⲁⲛⲁⲅⲛⲱⲥⲧⲏⲥ', color: 'yellow' },
    people: { english: 'People', arabic: 'الشعب', coptic: 'Ⲡⲓⲗⲁⲟⲥ', color: 'orange' },
    '': { english: '', arabic: '', coptic: '', color: '' },
}

interface SpeakerLabelProps {
    speaker: Speaker
}
const SpeakerLabel = ({ speaker }: SpeakerLabelProps) => {
    const { english, arabic, color } = SPEAKER_LABEL_MAP[speaker || '']

    return !!speaker ? (
        <Stack spaceBelow="s">
            <MultiLingualText variant="body" color={color} text={{ english, arabic }} />
        </Stack>
    ) : null
}

interface VersesSectionProps {
    section: Types.VersesSection
}
export const VersesSection = ({ section: { speaker, verses } }: VersesSectionProps) => {
    return (
        <>
            {!!speaker && <SpeakerLabel speaker={speaker} />}

            <Stack direction="column" gap="l">
                {!!verses && verses.map((verse, i) => <MultiLingualText key={i} variant="body" gap="m" text={verse} />)}
            </Stack>
        </>
    )
}

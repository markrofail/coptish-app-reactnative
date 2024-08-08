import React from 'react'
import { Stack } from '../Stack'
import { MultiLingualText } from '../MultiLingualText'
import { VersesSection } from './VersesSection'
import { ReadingSection } from './ReadingSection'
import { Types } from '../../types'
import { CompoundPrayersSection } from './CompoundPrayerSection'
import { InfoSection } from './InfoSection'

interface PrayerProps {
    prayer: Types.Prayer
}

export const Prayer = ({ prayer: { title, sections, hidden } }: PrayerProps) => {
    return (
        <Stack spaceAbove="s" spaceBelow="xl">
            {/* Prayer Title */}
            {hidden !== false && (
                <Stack spaceBelow="l">
                    <MultiLingualText variant="heading2" text={{ english: title.english, arabic: title.arabic }} centered />
                </Stack>
            )}

            {/* Prayer Body */}
            {sections?.map(({ type, ...section }, i) => (
                <Stack spaceBelow="m" key={i}>
                    {type === 'info' && <InfoSection section={section as Types.InfoSection} />}
                    {type === 'compound-prayer' && <CompoundPrayersSection section={section as Types.CompoundPrayerSection} />}
                    {type === 'reading' && <ReadingSection section={section as Types.ReadingSection} />}
                    {(!type || type === 'verses') && <VersesSection section={section as Types.VersesSection} />}
                </Stack>
            ))}
        </Stack>
    )
}

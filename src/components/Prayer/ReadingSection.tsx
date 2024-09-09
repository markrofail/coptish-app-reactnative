import React, { Fragment } from 'react'
import { MultiLingualText } from '../MultiLingualText'
import { useMemoAsync } from '../../hooks/useMemoAsync'
import * as Types from '../../types'
import { loadReading } from '../../utils/assets'
import { Stack } from '../Stack'
import { useSettings } from '../../hooks/useSettings'
import { CurrentDate } from '../../utils/settings'

export interface ReadingSectionProps {
    section: Types.ReadingSection
}

export const ReadingSection = ({ section: { readingType } }: ReadingSectionProps) => {
    const date = useSettings(CurrentDate, new Date())
    const reading = useMemoAsync(() => loadReading(date, readingType), [])

    return reading ? (
        <Stack gap="m">
            <MultiLingualText variant="heading2" gap="m" text={reading.title} />

            {readingType !== 'synaxarium' ? ( //
                <Reading {...(reading as Types.Reading)} />
            ) : (
                <Synaxarium {...(reading as Types.Synaxarium)} />
            )}
        </Stack>
    ) : null
}

const Reading = ({ text }: Types.Reading) => {
    return <MultiLingualText variant="body" gap="m" text={text} />
}

const Synaxarium = ({ commemorations }: Types.Synaxarium) => {
    return (
        <>
            {commemorations.map(({ title, text }, i) => (
                <Fragment key={i}>
                    <MultiLingualText variant="body" gap="m" text={title} />
                    <MultiLingualText variant="body" gap="m" text={text} />
                </Fragment>
            ))}
        </>
    )
}

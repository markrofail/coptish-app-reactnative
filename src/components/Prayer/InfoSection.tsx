import React from 'react'
import * as Types from '../../types'
import { Stack } from '../Stack'
import { MultiLingualText } from '../MultiLingualText'

interface InfoSectionProps {
    section: Types.InfoSection
}

export const InfoSection = ({ section: { text } }: InfoSectionProps) =>
    !!text && (
        <Stack>
            <MultiLingualText variant="body" color="yellow" text={text} />
        </Stack>
    )

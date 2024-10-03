import React from 'react'
import * as Types from '../../types'
import { useMemoAsync } from '../../hooks/useMemoAsync'
import { loadPrayer } from '../../utils/assets'
import { Prayer } from './Prayer'
import { SkeletonPrayer } from '../SkeletonPrayer'

interface CompoundPrayersSectionProps {
    section: Types.CompoundPrayerSection
}

export const CompoundPrayersSection = ({ section: { path } }: CompoundPrayersSectionProps) => {
    const prayers = useMemoAsync(() => loadPrayer(path, 'annual'), [path])
    return !!prayers ? (
        <>
            {prayers[0].prayers.map((prayer, i) => (
                <Prayer key={i} prayer={prayer} />
            ))}
        </>
    ) : (
        <SkeletonPrayer />
    )
}

import React from 'react'
import { Types } from '../../types'
import { useMemoAsync } from '../../hooks/useMemoAsync'
import { loadCompoundPrayer } from '../../utils/assets'
import { Prayer } from './Prayer'
import { GradientProps, SkeletonContainer } from 'react-native-dynamic-skeletons'
import { LinearGradient } from 'expo-linear-gradient'
import { Dimensions, View } from 'react-native'

interface CompoundPrayersSectionProps {
    section: Types.CompoundPrayerSection
}

const SCREEN_HEIGHT = Dimensions.get('window').height

const Gradient = (props: GradientProps) => <LinearGradient {...props} />

export const CompoundPrayersSection = ({ section: { path } }: CompoundPrayersSectionProps) => {
    const prayers = useMemoAsync(() => loadCompoundPrayer(path), [path])
    return !!prayers ? (
        <>
            {prayers.map((prayer, i) => (
                <Prayer key={i} prayer={prayer} />
            ))}
        </>
    ) : (
        <SkeletonContainer //
            isLoading={true}
            Gradient={Gradient}
            colors={['#000000', '#383838', '#000000']}
            style={{ backgroundColor: '#000000' }}
            duration={2 * 1000}
        >
            <View style={{ width: '50%', height: 50, borderRadius: 8, marginBottom: 20 }} />
            <>
                {[1, 2, 3, 4, 5].map((i) => (
                    <View key={i} style={{ width: '100%', height: SCREEN_HEIGHT * 0.1, borderRadius: 8, marginBottom: 20 }} />
                ))}
            </>
        </SkeletonContainer>
    )
}

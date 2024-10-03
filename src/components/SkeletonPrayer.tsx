import React from 'react'
import { StyleSheet, View } from 'react-native'
import { GradientProps, SkeletonContainer } from 'react-native-dynamic-skeletons'
import { LinearGradient } from 'expo-linear-gradient'
import { scale, verticalScale } from 'react-native-size-matters'

const Gradient = (props: GradientProps) => <LinearGradient {...props} />

export const SkeletonPrayer = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
            <SkeletonContainer //
                isLoading={true}
                Gradient={Gradient}
                colors={['#000000', '#383838', '#000000']}
                style={{ backgroundColor: '#000000' }}
                duration={2_000}
            >
                <View style={styles.title} />
                <View style={styles.verse} />
                <View style={styles.verse} />
                <View style={styles.verse} />
                <View style={styles.verse} />
                <View style={styles.verse} />
            </SkeletonContainer>
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        width: '50%',
        height: verticalScale(48),
        borderRadius: scale(8),
        marginBottom: verticalScale(24),
    },
    verse: {
        width: '100%',
        height: verticalScale(96),
        borderRadius: scale(8),
        marginBottom: verticalScale(24),
    },
})

import React, { useState, useEffect, useRef } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Button, Divider, IconButton, List, Switch, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { scale, verticalScale } from 'react-native-size-matters'
import { Settings, useSettings } from '@/src/hooks/useSettings'
import { Saint } from '@/src/types'
import { SelectField, MultiSelectField, RangeField, DateField, SelectFieldMethods } from './fields'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '@/src/routes'

const UI_LANGUAGE_OPTIONS = [
    { label: 'English', value: 'english' },
    { label: 'Arabic', value: 'arabic' },
] as const

const COPTIC_TRANSLITERATION_LANGUAGE_OPTIONS = [
    { label: 'Off', value: 'off' },
    { label: 'English', value: 'coptic_english' },
    { label: 'Arabic', value: 'coptic_arabic' },
] as const

const SAINTS_LABELS: Record<Saint, string> = {
    'any-martyr-all': 'Any Martyr All',
    'archangel-gabriel': 'Archangel Gabriel',
    'archangel-michael': 'Archangel Michael',
    'archangel-raphael': 'Archangel Raphael',
    'archangel-suriel': 'Archangel Suriel',
    'pope-kyrillos-vi': 'Pope Kyrillos Vi',
    'st-abanoub': 'St Abanoub',
    'st-abraam': 'St Abraam',
    'st-antony-the-great': 'St Antony The Great',
    'st-athanasius-the-apostolic': 'St Athanasius The Apostolic',
    'st-bishoy': 'St Bishoy',
    'st-demiana': 'St Demiana',
    'st-george': 'St George',
    'st-john-the-baptist': 'St John The Baptist',
    'st-karas-the-anchorite': 'St Karas The Anchorite',
    'st-marina-the-martyr': 'St Marina The Martyr',
    'st-mark': 'St Mark',
    'st-mary': 'St Mary',
    'st-mina': 'St Mina',
    'st-moses-the-black': 'St Moses The Black',
    'st-paul-the-1st-hermit': 'St Paul The 1st Hermit',
    'st-philopater-mercurius': 'St Philopater Mercurius',
    'st-reweis-teji': 'St Reweis Teji',
    'st-shenouda-the-archimandrite': 'St Shenouda The Archimandrite',
    'st-stephen': 'St Stephen',
    'st-thomas-the-hermit': 'St Thomas The Hermit',
    'sts-maximos-and-dometius': 'Sts Maximos And Dometius',
    'sts-sergios-and-bachus': 'Sts Sergios And Bachus',
}
const SAINTS_OPTIONS = Object.entries(SAINTS_LABELS).map(([value, label]) => ({ label, value }))

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Settings'>

export const SettingsScreen = () => {
    const navigation = useNavigation<NavigationProps>()
    const [storedSettings, saveSettings] = useSettings()
    const [localSettings, setLocalSettings] = useState(storedSettings)
    const [versionClickCount, setVersionClickCount] = useState(0)
    const uiLanguageRef = useRef<SelectFieldMethods>(null)
    const copticTransliterationLanguageRef = useRef<SelectFieldMethods>(null)
    const churchSaintsRef = useRef<SelectFieldMethods>(null)
    const { fontSize, currentDate, darkMode, uiLanguage, copticTransliterationLanguage, churchSaints } = localSettings
    useEffect(() => {
        setLocalSettings(storedSettings)
    }, [storedSettings])

    const onDismiss = () => {
        navigation.goBack()
    }
    const onSave = () => {
        saveSettings(localSettings)
        onDismiss()
    }
    const onSettingsChange =
        <K extends keyof Settings>(key: K) =>
        (value: Settings[K]) => {
            setLocalSettings((prev) => ({ ...prev, [key]: value }))
        }
    const onVersionPress = () => {
        if (versionClickCount === 10) navigation.navigate('Debug')
        else setVersionClickCount(versionClickCount + 1)
    }

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <IconButton icon="arrow-left" size={20} onPress={onDismiss} />,
            headerRight: () => (
                <Button onPress={onSave}>
                    <Text>Apply</Text>
                </Button>
            ),
        })
    }, [navigation, onDismiss, onSave])

    const insets = useSafeAreaInsets()
    const padding = {
        paddingBottom: insets.bottom,
        paddingLeft: Math.max(insets.left, scale(16)),
        paddingRight: Math.max(insets.right, scale(16)),
    }

    return (
        <ScrollView style={{ ...styles.container, ...padding }}>
            <List.Section style={styles.logoContainer}>
                <Image source={require('@/assets/images/icon-black.png')} style={styles.logo} />
                <TouchableOpacity onPress={onVersionPress}>
                    <Text style={styles.versionText}>App Version 2.24 #50491</Text>
                </TouchableOpacity>
            </List.Section>

            <List.Section>
                <View style={styles.section}>
                    <List.Item
                        title="Current Date"
                        right={() => <DateField.Input value={currentDate} onChange={onSettingsChange('currentDate')} />}
                        description={<DateField.Preview value={currentDate} onChange={onSettingsChange('currentDate')} />}
                    />
                </View>
            </List.Section>

            <List.Section>
                <List.Subheader>User Interface</List.Subheader>
                <View style={styles.section}>
                    <List.Item
                        title="Language"
                        onPress={() => uiLanguageRef.current?.openMenu()}
                        right={() => (
                            <SelectField.Input value={uiLanguage} ref={uiLanguageRef} onChange={onSettingsChange('uiLanguage')} options={UI_LANGUAGE_OPTIONS} />
                        )}
                        description={<SelectField.Preview value={uiLanguage} options={UI_LANGUAGE_OPTIONS} />}
                    />
                    <Divider />
                    <List.Item
                        title="Dark Mode" //
                        right={() => <Switch value={darkMode} onValueChange={onSettingsChange('darkMode')} disabled />}
                    />
                </View>
            </List.Section>

            <List.Section>
                <List.Subheader>Presentation</List.Subheader>
                <View style={styles.section}>
                    <List.Item
                        title="Font Size"
                        right={() => (
                            <RangeField.Input
                                value={fontSize}
                                onChange={onSettingsChange('fontSize')}
                                options={{ minimumValue: 6, maximumValue: 30, step: 1 }}
                            />
                        )}
                        description={<RangeField.Preview value={fontSize} units="pt" />}
                    />
                    <Divider />
                    <List.Item
                        title="Coptic Transliteration"
                        onPress={() => copticTransliterationLanguageRef.current?.openMenu()}
                        right={() => (
                            <SelectField.Input
                                ref={copticTransliterationLanguageRef}
                                onChange={onSettingsChange('copticTransliterationLanguage')}
                                options={COPTIC_TRANSLITERATION_LANGUAGE_OPTIONS}
                                disabled
                            />
                        )}
                        description={<SelectField.Preview value={copticTransliterationLanguage} options={COPTIC_TRANSLITERATION_LANGUAGE_OPTIONS} />}
                    />
                    <Divider />
                    <List.Item
                        title="Church Saints"
                        onPress={() => churchSaintsRef.current?.openMenu()}
                        right={() => (
                            <MultiSelectField.Input
                                ref={churchSaintsRef}
                                value={churchSaints}
                                options={SAINTS_OPTIONS}
                                onChange={onSettingsChange('churchSaints')}
                                disabled
                            />
                        )}
                        description={<MultiSelectField.Preview value={churchSaints} options={SAINTS_OPTIONS} onChange={onSettingsChange('churchSaints')} />}
                    />
                </View>
            </List.Section>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: scale(120),
        height: undefined,
        aspectRatio: 1,
    },
    container: {
        backgroundColor: '#F5F5F5',
        gap: verticalScale(12),
    },
    section: {
        backgroundColor: 'white',
        borderRadius: scale(8),
    },
    versionText: {
        textAlign: 'center',
        color: 'grey',
        marginBottom: verticalScale(8),
    },
})

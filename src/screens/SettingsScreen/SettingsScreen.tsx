import React, { useState, useEffect } from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Divider, List, Switch, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { scale, verticalScale } from 'react-native-size-matters'
import { Settings, useSettings } from '@/src/hooks/useSettings'
import { SelectField } from './SelectField'
import { RangeField } from './RangeField'
import { useNavigation } from '@react-navigation/native'
import { DateField } from './DateField'
import { MultiSelectField } from './MultiSelectField'
import { SAINTS } from '@/src/types'

const UI_LANGUAGE_OPTIONS = [
    { label: 'English', value: 'english' },
    { label: 'Arabic', value: 'arabic' },
] as const

const COPTIC_TRANSLITERATION_LANGUAGE_OPTIONS = [
    { label: 'Off', value: 'off' },
    { label: 'English', value: 'coptic_english' },
    { label: 'Arabic', value: 'coptic_arabic' },
] as const

const SAINTS_OPTIONS = SAINTS.map((saint) => ({ label: saint, value: saint }))

export const SettingsScreen = () => {
    const navigation = useNavigation()
    const [storedSettings, saveSettings] = useSettings()
    const [localSettings, setLocalSettings] = useState(storedSettings)
    const { fontSize, currentDate, darkMode, uiLanguage, copticTransliterationLanguage, churchSaints } = localSettings

    const onDismiss = () => navigation.goBack()
    const onSave = () => {
        console.log({ localSettings })
        saveSettings(localSettings)
        onDismiss()
    }
    const onSettingsChange =
        <K extends keyof Settings>(key: K) =>
        (value: Settings[K]) =>
            setLocalSettings((prev) => ({ ...prev, [key]: value }))

    useEffect(() => {
        setLocalSettings(storedSettings)
    }, [storedSettings])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button onPress={onSave}>
                    <Text>Apply</Text>
                </Button>
            ),
        })
    }, [navigation, onSave])

    const insets = useSafeAreaInsets()
    const padding = {
        paddingBottom: insets.bottom,
        paddingLeft: Math.max(insets.left, scale(16)),
        paddingRight: Math.max(insets.right, scale(16)),
    }

    return (
        <ScrollView style={{ ...styles.container, ...padding }}>
            <List.Section style={styles.logoContainer}>
                <Image source={require('@/assets/images/icon-black.png')} style={{ width: scale(120), height: undefined, aspectRatio: 1 }} />
                <Text style={styles.versionText}>App Version 2.24 #50491</Text>
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
                        right={() => <SelectField.Input onChange={onSettingsChange('uiLanguage')} options={UI_LANGUAGE_OPTIONS} />}
                        description={<SelectField.Preview value={uiLanguage} options={UI_LANGUAGE_OPTIONS} />}
                    />
                    <Divider />
                    <List.Item
                        title="Dark Mode" //
                        right={() => <Switch value={darkMode} onValueChange={onSettingsChange('darkMode')} />}
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
                        right={() => (
                            <SelectField.Input onChange={onSettingsChange('copticTransliterationLanguage')} options={COPTIC_TRANSLITERATION_LANGUAGE_OPTIONS} />
                        )}
                        description={<SelectField.Preview value={copticTransliterationLanguage} options={COPTIC_TRANSLITERATION_LANGUAGE_OPTIONS} />}
                    />
                    <Divider />
                    <List.Item
                        title="Church Saints"
                        right={() => <MultiSelectField.Input value={churchSaints} options={SAINTS_OPTIONS} onChange={onSettingsChange('churchSaints')} />}
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
        marginBottom: 20,
    },
})

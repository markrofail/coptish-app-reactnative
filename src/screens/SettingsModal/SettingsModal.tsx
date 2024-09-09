import React, { useEffect } from 'react'
import { View } from 'react-native'
import { Button, Modal, Portal, Text } from 'react-native-paper'
import { FontSizeField } from './fields/FontSizeField'
import { CurrentDateField } from './fields/CurrentDateField'
import { CurrentDate, FontSize } from '../../utils/settings'

interface SettingsModalProps {
    visible: boolean
    onDismiss: () => void
}
export const SettingsModal = ({ visible, onDismiss }: SettingsModalProps) => {
    const [fontSize, setFontSize] = React.useState(10)
    const [currentDate, setCurrentDate] = React.useState<Date | undefined>(undefined)

    useEffect(() => {
        FontSize.get().then(setFontSize)
        CurrentDate.get().then(setCurrentDate)
    }, [])

    const onSave = () => {
        FontSize.set(fontSize)
        CurrentDate.set(currentDate)

        onDismiss()
    }

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                style={{ height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center' }}
                contentContainerStyle={{ backgroundColor: 'black', width: '75%', padding: 25, borderRadius: 25 }}
            >
                {/** Header */}
                <View style={{ marginBottom: 20 }}>
                    <Text variant="headlineLarge" style={{ color: 'white' }}>
                        Settings
                    </Text>
                </View>

                {/** Body */}
                <View style={{ marginBottom: 20, gap: 5 }}>
                    <FontSizeField value={fontSize} onChange={setFontSize} />

                    <CurrentDateField value={currentDate} onChange={setCurrentDate} />
                </View>

                {/** Footer */}
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <Button mode="contained" onPress={onSave} style={{ backgroundColor: 'white' }}>
                        <Text style={{ color: 'black' }}>Save</Text>
                    </Button>
                    <Button onPress={onDismiss}>
                        <Text style={{ color: 'white' }}>Cancel</Text>
                    </Button>
                </View>
            </Modal>
        </Portal>
    )
}

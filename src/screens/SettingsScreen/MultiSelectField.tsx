import React from 'react'
import { Menu, List, Text, Chip } from 'react-native-paper'
import { useToggle } from '../../hooks/useToggle'
import { StyleSheet, View } from 'react-native'
import { verticalScale } from 'react-native-size-matters'
import { TouchableOpacity } from 'react-native-gesture-handler'

interface MultiSelectFieldProps<T> {
    value: T[]
    onChange: (value: T[]) => void
    options: readonly { label: string; value: T }[]
}

type MultiSelectFieldInputProps<T> = MultiSelectFieldProps<T>
const MultiSelectFieldInput = <T,>({ value, options, onChange }: MultiSelectFieldInputProps<T>) => {
    const [showDropdown, toggleShowDropdown] = useToggle(false)
    const filteredOptions = options.filter((option) => !value.includes(option.value))
    const onOptionPress = (option: T) => () => {
        onChange([...value, option])
        toggleShowDropdown()
    }

    return (
        <Menu
            visible={showDropdown}
            onDismiss={toggleShowDropdown}
            anchor={
                <TouchableOpacity onPress={toggleShowDropdown}>
                    <List.Icon icon="chevron-right" />
                </TouchableOpacity>
            }
        >
            {filteredOptions.map((option) => (
                <Menu.Item key={`${option.label}`} title={`${option.label}`} onPress={onOptionPress(option.value)} />
            ))}
        </Menu>
    )
}

type MultiSelectFieldPreviewProps<T> = MultiSelectFieldProps<T>
const MultiSelectFieldPreview = <T,>({ value, options, onChange }: MultiSelectFieldPreviewProps<T>) => {
    const remove = (item: T) => () => onChange(value.filter((e) => e !== item))
    const getLabel = (item: T) => options.find((option) => option.value === item)?.label

    return (
        <View style={styles.previewContainer}>
            {value?.map((item) => (
                <Chip key={`${item}`} onClose={remove(item)} compact>
                    <Text variant="bodySmall">{getLabel(item)}</Text>
                </Chip>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    previewContainer: { paddingTop: verticalScale(6), flexDirection: 'row', flexWrap: 'wrap', gap: verticalScale(2) },
})

export const MultiSelectField = { Input: MultiSelectFieldInput, Preview: MultiSelectFieldPreview }

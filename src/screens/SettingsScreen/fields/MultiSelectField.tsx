import React, { ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Menu, List, Text, Chip } from 'react-native-paper'
import { verticalScale } from 'react-native-size-matters'
import { useToggle } from '../../../hooks/useToggle'
import { SelectFieldMethods } from './SelectField'

interface MultiSelectFieldProps<T> {
    value: T[]
    onChange: (value: T[]) => void
    options: readonly { label: string; value: T }[]
    disabled?: boolean
}

type MultiSelectFieldInputProps<T> = MultiSelectFieldProps<T>
const MultiSelectFieldInput = forwardRef(<T,>({ value, options, onChange, disabled }: MultiSelectFieldInputProps<T>, ref: ForwardedRef<SelectFieldMethods>) => {
    const [showDropdown, toggleShowDropdown] = useToggle(false)

    useImperativeHandle(ref, () => ({
        openMenu: toggleShowDropdown,
    }))

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
                <TouchableOpacity onPress={toggleShowDropdown} disabled>
                    <List.Icon icon="chevron-right" />
                </TouchableOpacity>
            }
        >
            {filteredOptions.map((option) => (
                <Menu.Item key={`${option.label}`} title={`${option.label}`} onPress={onOptionPress(option.value)} />
            ))}
        </Menu>
    )
}) as <T>(props: MultiSelectFieldInputProps<T> & { ref?: ForwardedRef<SelectFieldMethods> }) => JSX.Element

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

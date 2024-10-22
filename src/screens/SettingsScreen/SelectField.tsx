import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Menu, List, Text } from 'react-native-paper'
import { useToggle } from '../../hooks/useToggle'

interface SelectFieldProps<T> {
    value: T
    onChange: (value: T) => void
    options: readonly { label: string; value: T }[]
}

type SelectFieldInputProps<T> = Pick<SelectFieldProps<T>, 'onChange' | 'options'>
const SelectFieldInput = <T,>({ options, onChange }: SelectFieldInputProps<T>) => {
    const [showDropdown, toggleShowDropdown] = useToggle(false)
    const onOptionPress = (option: T) => () => {
        onChange(option)
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
            {options.map((option) => (
                <Menu.Item key={option.label} title={option.label} onPress={onOptionPress(option.value)} />
            ))}
        </Menu>
    )
}

type SelectFieldPreviewProps<T> = Pick<SelectFieldProps<T>, 'value' | 'options'>
const SelectFieldPreview = <T,>({ value, options }: SelectFieldPreviewProps<T>) => {
    const valueStr = options.find((option) => option.value === value)?.label
    return <Text>{valueStr}</Text>
}

export const SelectField = { Input: SelectFieldInput, Preview: SelectFieldPreview }

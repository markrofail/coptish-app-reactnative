import React, { ForwardedRef, forwardRef, RefObject, useImperativeHandle } from 'react'
import { TouchableOpacity } from 'react-native'
import { Menu, List, Text } from 'react-native-paper'
import { useToggle } from '../../../hooks/useToggle'

interface SelectFieldProps<T> {
    value: T
    onChange: (value: T) => void
    options: readonly { label: string; value: T }[]
}

export interface SelectFieldMethods {
    openMenu: () => void
}

type SelectFieldInputProps<T> = Pick<SelectFieldProps<T>, 'onChange' | 'options'>
const SelectFieldInput = forwardRef(<T,>({ options, onChange }: SelectFieldInputProps<T>, ref: ForwardedRef<SelectFieldMethods>) => {
    const [showDropdown, toggleShowDropdown] = useToggle(false)

    useImperativeHandle(ref, () => ({
        openMenu: toggleShowDropdown,
    }))

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
}) as <T>(props: SelectFieldInputProps<T> & { ref?: ForwardedRef<SelectFieldMethods> }) => JSX.Element

type SelectFieldPreviewProps<T> = Pick<SelectFieldProps<T>, 'value' | 'options'>
const SelectFieldPreview = <T,>({ value, options }: SelectFieldPreviewProps<T>) => {
    const valueStr = options.find((option) => option.value === value)?.label
    return <Text variant="bodySmall">{valueStr}</Text>
}

export const SelectField = { Input: SelectFieldInput, Preview: SelectFieldPreview }

import React, { ForwardedRef, forwardRef, Fragment, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { FlatList, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { List, Text, Button } from 'react-native-paper'
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { scale, verticalScale } from 'react-native-size-matters'

interface SelectFieldProps<T> {
    value: T
    onChange: (value: T) => void
    options: readonly { label: string; value: T }[]
    disabled?: boolean
}

export interface SelectFieldMethods {
    openMenu: () => void
}

const SelectFieldInput = forwardRef(<T,>({ value, onChange, options, disabled }: SelectFieldProps<T>, ref: ForwardedRef<SelectFieldMethods>) => {
    const [internalValue, setInternalValue] = useState(value)
    const bottomSheetModalRef = useRef<BottomSheetModal<any>>(null)

    const snapPoints = useMemo(() => ['50%', '75%'], []) // Added another snap point for more content

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present()
        setInternalValue(value)
    }, [value])

    const handleDismissModalPress = useCallback(() => {
        bottomSheetModalRef.current?.dismiss()
        onChange(internalValue)
    }, [onChange, internalValue])

    const handleValueChange = useCallback((itemValue: T) => {
        setInternalValue(itemValue)
        handleDismissModalPress()
    }, [])

    // Render function for FlatList items
    const renderItem = useCallback(
        ({ item }: { item: { label: string; value: T } }) => (
            <TouchableWithoutFeedback onPress={() => handleValueChange(item.value)}>
                <View style={styles.optionItem}>
                    <Text style={styles.optionLabel}>{item.label}</Text>
                </View>
            </TouchableWithoutFeedback>
        ),
        [handleValueChange],
    )

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
        [],
    )

    useImperativeHandle(ref, () => ({
        openMenu: handlePresentModalPress,
    }))

    return (
        <>
            <TouchableWithoutFeedback onPress={handlePresentModalPress} disabled={disabled}>
                <List.Icon icon="chevron-right" />
            </TouchableWithoutFeedback>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onDismiss={handleDismissModalPress}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                enableDynamicSizing
            >
                <BottomSheetView style={styles.bottomSheetContent}>
                    {/* List of options */}
                    <FlatList
                        data={options}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.value}-${index}`} // Unique key
                        contentContainerStyle={styles.optionsListContainer}
                    />
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}) as <T>(props: SelectFieldProps<T> & { ref?: ForwardedRef<SelectFieldMethods> }) => JSX.Element

const styles = StyleSheet.create({
    bottomSheetContent: {
        flex: 1,
        paddingHorizontal: scale(20),
        paddingTop: scale(20),
        paddingBottom: verticalScale(40),
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: scale(10),
    },
    pickerItem: {
        fontSize: 18,
    },
    optionsListContainer: {
        // Optional: add padding or margin to the list container
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionLabel: {
        fontSize: 16,
        flex: 1, // Allow label to take up space
        marginRight: 10, // Space between label and checkbox
    },
})

type SelectFieldPreviewProps<T> = Pick<SelectFieldProps<T>, 'value' | 'options'>
const SelectFieldPreview = <T,>({ value, options }: SelectFieldPreviewProps<T>) => {
    const valueStr = options.find((option) => option.value === value)?.label
    return <Text variant="bodySmall">{valueStr}</Text>
}

export const SelectField = { Input: SelectFieldInput, Preview: SelectFieldPreview }

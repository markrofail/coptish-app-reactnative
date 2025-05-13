import React, { ForwardedRef, forwardRef, Fragment, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View, TextInput, FlatList } from 'react-native'
import { List, Text, Button, Checkbox, Chip } from 'react-native-paper'
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop, BottomSheetBackdropProps } from '@gorhom/bottom-sheet'
import { scale, verticalScale } from 'react-native-size-matters'

interface MultiSelectFieldProps<T> {
    value: T[] // Value is now an array
    onChange: (value: T[]) => void // onChange handles an array
    options: readonly { label: string; value: T }[]
    disabled?: boolean
    placeholder?: string // Added placeholder for search input
}

export interface MultiSelectFieldMethods {
    openMenu: () => void
}

const MultiSelectFieldInput = forwardRef(
    <T,>({ value, onChange, options, disabled, placeholder = 'Search...' }: MultiSelectFieldProps<T>, ref: ForwardedRef<MultiSelectFieldMethods>) => {
        // State to manage the selected values while the bottom sheet is open
        const [internalValue, setInternalValue] = useState<T[]>(value)
        // State for the search query
        const [searchQuery, setSearchQuery] = useState('')
        const bottomSheetModalRef = useRef<BottomSheetModal>(null)

        const snapPoints = useMemo(() => ['50%'], [])

        // Filter options based on search query
        const filteredOptions = useMemo(() => {
            if (!searchQuery) {
                return options
            }
            const lowerCaseQuery = searchQuery.toLowerCase()
            return options.filter((option) => option.label.toLowerCase().includes(lowerCaseQuery))
        }, [options, searchQuery])

        // Handler to open the bottom sheet
        const handlePresentModalPress = useCallback(() => {
            bottomSheetModalRef.current?.present()
            // Initialize internal state with the current value from props
            setInternalValue(value)
            // Clear search query when opening
            setSearchQuery('')
        }, [value])

        // Handler to dismiss the bottom sheet and update the parent
        const handleDismissModalPress = useCallback(() => {
            bottomSheetModalRef.current?.dismiss()
            // Pass the selected values back to the parent
            onChange(internalValue)
        }, [onChange, internalValue])

        // Handler to toggle selection of an item
        const handleToggleSelection = useCallback((itemValue: T) => {
            setInternalValue((prevSelected) => {
                if (prevSelected.includes(itemValue)) {
                    // Item is already selected, remove it
                    return prevSelected.filter((value) => value !== itemValue)
                } else {
                    // Item is not selected, add it
                    return [...prevSelected, itemValue]
                }
            })
        }, [])

        const isItemSelected = useCallback((itemValue: T) => internalValue.includes(itemValue), [internalValue])

        const renderItem = useCallback(
            ({ item }: { item: { label: string; value: T } }) => (
                <TouchableWithoutFeedback onPress={() => handleToggleSelection(item.value)}>
                    <View style={styles.optionItem}>
                        <Text style={styles.optionLabel}>{item.label}</Text>
                        <Checkbox.Android
                            status={isItemSelected(item.value) ? 'checked' : 'unchecked'}
                            onPress={() => handleToggleSelection(item.value)} // Checkbox press also toggles
                        />
                    </View>
                </TouchableWithoutFeedback>
            ),
            [handleToggleSelection, isItemSelected],
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
                        {/* Search Input */}
                        <TextInput style={styles.searchInput} placeholder={placeholder} value={searchQuery} onChangeText={setSearchQuery} />

                        {/* List of searchable options */}
                        <FlatList
                            data={filteredOptions}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => `${item.value}-${index}`} // Unique key
                            contentContainerStyle={styles.optionsListContainer}
                        />
                    </BottomSheetView>
                </BottomSheetModal>
            </>
        )
    },
) as <T>(props: MultiSelectFieldProps<T> & { ref?: ForwardedRef<MultiSelectFieldMethods> }) => JSX.Element

type MultiSelectFieldPreviewProps<T> = MultiSelectFieldProps<T>
const MultiSelectFieldPreview = <T,>({ value, options, onChange }: MultiSelectFieldPreviewProps<T>) => {
    const remove = (item: T) => () => onChange(value.filter((e) => e !== item))
    const getLabel = (item: T) => options.find((option) => option.value === item)?.label

    return (
        <View style={styles.previewContainer}>
            {value?.map((item) => (
                <Fragment key={`${item}`}>
                    <Chip onClose={remove(item)} compact>
                        <Text variant="bodySmall">{getLabel(item)}</Text>
                    </Chip>
                </Fragment>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    previewContainer: { paddingTop: verticalScale(6), flexDirection: 'row', flexWrap: 'wrap', gap: verticalScale(2) },
    bottomSheetContent: {
        flex: 1, // Allow content to take available space in the bottom sheet
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
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10, // Space between search and list
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

export const MultiSelectField = { Input: MultiSelectFieldInput, Preview: MultiSelectFieldPreview }

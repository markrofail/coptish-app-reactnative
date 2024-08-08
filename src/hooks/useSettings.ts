import { useState, useEffect } from 'react'
import { CurrentDate, ZoomMultiplier } from '../utils/settings'

export const useSettings = <T>(Property: typeof ZoomMultiplier | typeof CurrentDate, initial: T) => {
    const [value, setValue] = useState<T>(initial)
    useEffect(() => {
        const setter = async () => {
            const value: T = (await Property.get()) as unknown as T
            setValue(value)
        }

        setter()
    }, [Property.lastModified])
    // console.log(`value: ${value}, lastModified: ${Property.lastModified}`)

    return !value || isNaN(value) ? initial : value
}

import { useState } from 'react'

export const useToggle = (initial: boolean = false) => {
    const [value, setValue] = useState(initial)
    const toggleValue = () => setValue((prev) => !prev)

    return [value, toggleValue] as const
}

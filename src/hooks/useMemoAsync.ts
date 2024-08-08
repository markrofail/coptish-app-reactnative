import { DependencyList, useEffect, useState } from 'react'

export function useMemoAsync<T>(promise: () => Promise<T>, deps: DependencyList, initial?: T) {
    const [value, setValue] = useState<T | undefined>(initial)

    useEffect(() => {
        promise().then(setValue)
    }, deps)

    return value
}

import AsyncStorage from '@react-native-async-storage/async-storage'

export class ZoomMultiplier {
    static KEY = 'settings/zoom-multiplier'
    static timestamp: Date | undefined = undefined

    static get lastModified() {
        return this.timestamp
    }

    static get = async () => {
        try {
            const value = await AsyncStorage.getItem(this.KEY)
            if (value !== null) {
                // value previously stored
                return parseFloat(value)
            }
        } catch (e) {
            // error reading value
            console.log(e)
        }

        return 1
    }

    static set = async (value: number) => {
        try {
            const oldValue = await ZoomMultiplier.get()
            if (oldValue === value) return

            await AsyncStorage.setItem(this.KEY, `${value}`)
            this.timestamp = new Date()
        } catch (e) {
            // saving error
            console.log(e)
        }
    }
}

export class FontSize {
    static get = async () => (await ZoomMultiplier.get()) * 10
    // export let timestamp = ZoomMultiplier.timestamp

    static set = async (value: number) => await ZoomMultiplier.set(value / 10)
}

export class CurrentDate {
    static KEY = 'settings/current-date'
    static timestamp: Date | undefined = undefined

    static get lastModified() {
        return this.timestamp
    }

    static get = async () => {
        try {
            const value = await AsyncStorage.getItem(this.KEY)
            if (!!value) {
                // value previously stored
                return new Date(value)
            }
        } catch (e) {
            // error reading value
            console.log(e)
        }

        return new Date()
    }

    static set = async (value?: Date) => {
        try {
            const oldValue = await CurrentDate.get()
            if (oldValue === value) return

            await AsyncStorage.setItem(this.KEY, `${value}`)
            this.timestamp = new Date()
        } catch (e) {
            // saving error
            console.log(e)
        }
    }
}

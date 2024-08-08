export namespace Types {
    export type ReadingType =
        | 'matins-psalm'
        | 'matins-gospel'
        | 'vespers-psalm'
        | 'vespers-gospel'
        | 'pauline-epistle'
        | 'catholic-epistle'
        | 'acts-of-the-apostles'
        | 'synaxarium'
        | 'liturgy-psalm'
        | 'liturgy-gospel'

    export type Reading = {
        title: MultiLingualText
        text: MultiLingualText
    }

    export type Synaxarium = {
        title: MultiLingualText
        commemorations: {
            title: MultiLingualText
            text: MultiLingualText
        }[]
    }

    export type InfoSection = {
        type: 'info'
        occasion?: Occasion
        text: MultiLingualText
    }

    export type CompoundPrayerSection = {
        type: 'compound-prayer'
        occasion?: Occasion
        path: string
    }

    export type ReadingSection = {
        type: 'reading'
        occasion?: Occasion
        readingType: ReadingType
    }

    export type MultiLingualText = {
        english?: string
        arabic?: string
        coptic?: string
        coptic_english?: string
        coptic_arabic?: string
    }

    export type Occasion = 'annual' | 'great-lent' | undefined
    export type Speaker = 'priest' | 'deacon' | 'reader' | 'people' | undefined

    export type VersesSection = {
        type?: 'verses'
        occasion?: Occasion
        speaker?: Speaker
        verses: MultiLingualText[]
    }

    export type Section = VersesSection | ReadingSection | CompoundPrayerSection | InfoSection

    export type Prayer = {
        id: string
        hidden?: boolean
        occasion?: Occasion
        title: MultiLingualText
        sections: Section[]
    }

    export type LiturgyChapter = {
        metadata?: { title?: MultiLingualText }
        prayers: Prayer[]
    }
    export type Liturgy = LiturgyChapter[]
}

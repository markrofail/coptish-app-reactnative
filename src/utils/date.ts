const COPTIC_DATE_FORMATTER = new Intl.DateTimeFormat('en-u-ca-coptic', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
})

export const getCopticDate = (date: Date): Record<'year' | 'month' | 'day', string> => {
    const dateParts = COPTIC_DATE_FORMATTER.formatToParts(date)
        .filter(({ type }) => type !== 'literal' && type !== 'era')
        .map(({ type, value }) => [type, value])

    return Object.fromEntries(dateParts)
}

export const getIsoCopticDate = (date: Date) => {
    const { month, day } = getCopticDate(date)
    return `${month}-${day}`.toLowerCase()
}

export const getIsoGeorgianDate = (date: Date) => date.toISOString().substring(0, 10)

type Mode = 'dd-mm' | 'dd-mm-yy' | 'iso'

export const getCopticDate = (date: Date | undefined, mode: Mode) => {
    if (!date || isNaN(date?.getTime())) date = new Date()

    const { day, month } = Object.fromEntries(
        new Intl.DateTimeFormat('en-u-ca-coptic', { day: 'numeric', month: 'long' })
            .formatToParts(date)
            .filter(({ type }) => type !== 'literal' && type !== 'era')
            .map(({ type, value }) => [type, value]),
    )

    if (mode === 'iso') return `${month}-${day}`.toLowerCase()
    if (mode === 'dd-mm') return `${day} ${month}`
    if (mode === 'dd-mm-yy') return new Intl.DateTimeFormat('en-u-ca-coptic', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
    return ''
}

export const getGeorgianDate = (date: Date | undefined, mode: Mode) => {
    if (!date || isNaN(date?.getTime())) date = new Date()

    if (mode === 'iso') date.toISOString().split('T').at(0)
    if (mode === 'dd-mm') return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long' }).format(date)
    if (mode === 'dd-mm-yy') return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
    return ''
}

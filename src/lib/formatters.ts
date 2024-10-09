export function formatEventDescription(durationInMinutes: number) {
    // get hours and minutes
    const hours = Math.floor(durationInMinutes / 60)
    const minutes = durationInMinutes % 60

    // adjust if singular
    const minutesString = `${minutes} ${minutes > 1 ? "mins" : "min"}`
    const hoursString = `${hours} ${hours > 1 ? "hrs" : "hr"}`

    // null if 0
    if (hours === 0) return minutesString
    if (minutes === 0) return hoursString

    // return concat hrs and mins
    return `${hoursString} ${minutesString}`
}
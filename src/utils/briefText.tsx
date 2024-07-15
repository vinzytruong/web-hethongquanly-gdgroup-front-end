export function briefText(text: string, numDisplay: number, limit: number) {
    if (text.length > limit) {
        return `${text?.slice(0, numDisplay)}...`
    }
    return text
}


export default function toChunks<T>(arr: Array<T>, chunkSize: number) {
    var result: any[] = []
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        result.push(chunk)
        // do whatever
    }
    return result;
}
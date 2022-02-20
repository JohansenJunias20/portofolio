

export default async function getCountry(): Promise<{ country: string, countryCode: string }> {
    const result = await (await fetch("http://ip-api.com/json")).json()
    return result
}
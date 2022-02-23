

export default async function getCountry(): Promise<{ country: string, countryCode: string }> {
    const result = await (await fetch(`${location.protocol}//ip-api.com/json`)).json()
    return result
}
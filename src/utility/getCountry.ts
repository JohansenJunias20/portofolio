

export default async function getCountry(): Promise<{ country: string, countryCode: string }> {
    const result = await (await fetch(`${location.protocol}//ipinfo.io/json`)).json()
    return { ...result, countryCode: result.country };
}
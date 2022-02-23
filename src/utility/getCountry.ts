

export default async function getCountry(): Promise<{ country: string, countryCode: string }> {
    const result = await (await fetch(`${location.protocol}//ipapi.co/json`)).json()
    return { ...result, countryCode: result.country_code };
}
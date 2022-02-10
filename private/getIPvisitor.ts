
declare var WS_DOMAIN: string;
declare var WS_PORT: string;
async function getIP() {
    const ip = await (await fetch('https://api.ipify.org?format=text')).text();

    const response = await (await fetch(`https://${WS_DOMAIN}:${WS_PORT}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            ip
        })
    })).text()
    console.log({ response })
}
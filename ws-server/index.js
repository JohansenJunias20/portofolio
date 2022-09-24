require('dotenv').config()
const { Server } = require("socket.io");
const fs = require('fs');

const production = process.env.PRODUCTION ? true : false;
const ssl = production ? process.env.PROD_WS_SSL == "TRUE" ? true : false : process.env.DEV_WS_SSL == "TRUE" ? true : false;
const domain = production ? process.env.PROD_WS_DOMAIN : process.env.DEV_WS_DOMAIN;
const express = require('express');
const app = new express();
const httpServer = ssl ? require("https").createServer({
    key: fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/live/${domain}/cert.pem`)
}) :
    require("http").createServer(app)
    ;
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*"
    }
});
const fetch = require('node-fetch');
const IDs = {};
io.on("connection", (socket) => {
    socket.on("spotify", (e) => {

    })
    socket.emit("id", socket.id);
    socket.on("offer", (e) => {
        const { id, sdp } = e;
        console.log("someone give offer");
        io.to(id).emit("offer", { id: socket.id, sdp }); //id unecessary
    })
    socket.on("answer", (e) => {
        console.log("answered", socket.id)
        const { id, sdp } = e;
        io.to(id).emit("answer", { id: socket.id, sdp }); //id unecessary
    })
    socket.on("candidate", ({ id, candidate }) => {
        console.log("someone give candidate");
        io.to(id).emit("candidate", { id: socket.id, candidate });
        // socket.broadcast.emit("candidate", { candidate });
    })
    socket.on("join", () => {
        console.log(`join room ${socket.id}`);
        // console.log({ IDs });
        console.log({ len: Object.keys(IDs).length });
        if (Object.keys(IDs).length == 0) return;
        socket.broadcast.emit("join", socket.id);
        // const cloneIDs = { ...IDs };
        // console.log({ cloneIDs })
        // cloneIDs[socket.id] = false;
        // socket.emit("players", cloneIDs);
    })
    // socket.on("init", (id_target) => {
    //     io.to(id_target).emit("init", ({ id: socket.id }));
    // }) //please init peerconnection first before offering because u cannot recieve icecandidate before new RTCpeerconnection
    socket.on("disconnect", () => {
        socket.broadcast.emit("left", socket.id);
        console.log("someone disconnected")
        delete IDs[socket.id];
        io.emit("players", IDs);
    })
    socket.on("country", (countryCode) => {
        IDs[socket.id].countryCode = countryCode;
        console.log({ countryCode })
        socket.broadcast.emit("players", IDs);
    })
    socket.on("players", () => {
        socket.emit("players", IDs);
    })
    socket.on("cl_ready", (id) => {
        console.log("client ready..", socket.id)
        io.to(id).emit("cl_ready", socket.id);
    })
    socket.on("rm_ready", (id) => {
        console.log("emmiting rm id", id)
        console.log("from:", socket.id)
        io.to(id).emit("rm_ready", socket.id);

    })
    socket.on("blur", ({ position, quartenion }) => {
        // socket.broadcast.emit("blur",{position,quartenion})
        console.log("someone blurred")
        IDs[socket.id].lastPos = position;
        IDs[socket.id].lastQuaternion = quartenion;
    })
    socket.on("nickname", (nickname, callback) => {
        IDs[socket.id].nickname = nickname;
        io.emit("players", IDs);
        callback({ status: true });
    })
    IDs[socket.id] = {
        guest_id: (() => {
            //random until get the unique id
            var random =
                Math.floor(Math.random() * 1000)
            while (Object.entries(IDs).find(([key, value]) => value.guest_id == random)) {
                var random =
                    Math.floor(Math.random() * 1000)

            }
            return random;

        })()
    };
    if (Object.keys(IDs).length == 1) {
        console.log("congratz u are the first connection", socket.id)
        socket.emit("first?", true)
    }
    io.emit("players", IDs);
    io.emit("initialized", true);
    console.log("emitting IDs", IDs)
    // console.log({ IDs })
    console.log(`someone made connection ${socket.id}`)
});


function LogError(error, location) {
    var result = [];
    if (!fs.existsSync("./log.json")) {
        fs.writeFileSync("./log.json", "[]", "utf-8");
    }
    result = fs.readFileSync("./log.json", "utf-8");
    result.push({ error, location });
    fs.writeFileSync("./log.json", JSON.stringify(result), "utf-8");

}
const spotify = {
    token: ""
}
setInterval(async () => {
    spotify.token = await getToken();
}, 3550 * 1000);
const refresh_token = fs.readFileSync("./refreshtoken.spotify.txt", "utf-8").replace(/(\r\n|\n|\r)/gm, "");
console.log({refresh_token});
async function getToken() {
    const url = "https://accounts.spotify.com/api/token";
    var details = {
        'refresh_token': refresh_token,
        'grant_type': 'refresh_token'
    };

    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    var response = await (await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": "Basic MTgxY2RlNjM3MDNjNGU4YTgxMDMyNTQ4ODM5ZDA1NDQ6ZTc2Zjg0Zjg0Y2Q2NDk3NmExYzg4Y2U2MDQ1M2E5NTk=",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody
    })).text();
    console.log({ response })
    response = JSON.parse(response)
    if (response.access_token) {
        spotify.token = response.access_token;
        return response.access_token;
    }
    else {
        // throw JSON.stringify(response);
        LogError(response, "150 index.js");
    }
}

async function requestSpotify() {
    console.log("request spotify")
    // ait requst spotify
    var response = await (await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
            "Authorization": `Bearer ${spotify.token ? spotify.token : await getToken()}`,
        }
    })).text()
    if (response == "") {
        //currently not playing anything
        broadcastSpotify({ is_playing: false })
        return;
    }
    response = JSON.parse(response)
    if (response.error) {
        LogError(response, "162 index.js");
        return;
    }
    // console.log({response});
    try{

        broadcastSpotify({ song_name: response.item.name, artist: response.item.artists[0].name, song_length: response.item.duration_ms / 1000, currentDuration: response.progress_ms / 1000, image_url: response.item.album.images[0].url, is_playing: true });
    }
    catch(ex){
        LogError(response,"192 index.js");
    }
    await new Promise(res => setTimeout(res, 1000));
    requestSpotify();
}
//to do:
requestSpotify();

function broadcastSpotify({ song_name, artist, song_length, currentDuration, image_url, is_playing }) {
    console.log("broadcasted..")
    //no song played
    io.emit("spotify", is_playing ? { image_url, song: { name: song_name, artist, length: song_length }, is_playing, currentDuration } : {});
}
// io.listen(process.env.PRODUCTION ? process.env.PROD_WS_PORT : process.env.DEV_WS_PORT, () => {
//     console.log("test")
// });
httpServer.listen(process.env.PRODUCTION ? process.env.PROD_WS_PORT : process.env.DEV_WS_PORT, () => {
    console.log({ ssl, port: process.env.PRODUCTION ? process.env.PROD_WS_PORT : process.env.DEV_WS_PORT })


})
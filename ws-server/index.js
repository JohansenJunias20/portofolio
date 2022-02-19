require('dotenv').config()
const { Server } = require("socket.io");
const fs = require('fs');

const production = process.env.PRODUCTION ? true : false;
const ssl = production ? process.env.PROD_WS_SSL == "TRUE" ? true : false : process.env.DEV_WS_SSL == "TRUE" ? true : false;
const domain = production ? process.env.PROD_WS_DOMAIN : process.env.DEV_WS_DOMAIN;
const express = require('express');
const httpServer = ssl ? require("https").createServer({
    key: fs.readFileSync(`/etc/letsencrypt/archive/${domain}/privkey1.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/archive/${domain}/cert1.pem`)
}) :
    require("http").createServer()
    ;
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*"
    }
});

const IDs = [];
io.on("connection", (socket) => {
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
    socket.on("init", (id_target) => {
        io.to(id_target).emit("init", ({ id: socket.id }));
    }) //please init peerconnection first before offering because u cannot recieve icecandidate before new RTCpeerconnection
    socket.on("disconnect", () => {
        socket.broadcast.emit("left", socket.id);
        console.log("someone disconnected")
        delete IDs[socket.id];
        console.log({ IDs })
    })
    socket.on("player_count", () => {
        socket.emit("player_count", io.engine.clientsCount);
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
    IDs[socket.id] = true;
    if (Object.keys(IDs).length == 1) {
        console.log("congratz u are the first connection", socket.id)
        socket.emit("first?", true)
    }
    socket.emit("id", socket.id);
    // console.log({ IDs })
    console.log(`someone made connection ${socket.id}`)
});
// io.listen(process.env.PRODUCTION ? process.env.PROD_WS_PORT : process.env.DEV_WS_PORT, () => {
//     console.log("test")
// });
httpServer.listen(process.env.PRODUCTION ? process.env.PROD_WS_PORT : process.env.DEV_WS_PORT, () => {
    console.log("done");

})
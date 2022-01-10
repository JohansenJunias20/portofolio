require('dotenv').config()
const { Server } = require("socket.io");
const fs = require('fs');

const production = process.env.PRODUCTION ? true : false;
const ssl = production ? process.env.PROD_WS_SSL == "TRUE" ? true : false : process.env.DEV_WS_SSL == "TRUE" ? true : false;
const domain = production ? process.env.PROD_WS_DOMAIN : process.env.DEV_WS_DOMAIN;
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
        const { id, sdp } = e;
        io.to(id).emit("answer", { id: socket.id, sdp }); //id unecessary
    })
    socket.on("candidate", ({ id, candidate }) => {
        console.log("someone give candidate");
        io.to(id).emit("candidate", { id: socket.id, candidate });
        // socket.broadcast.emit("candidate", { candidate });
    })
    socket.on("join", () => {
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
        delete IDs[socket.id];
    })
    socket.on("player_count", () => {
        socket.emit("player_count", io.engine.clientsCount);
    })
    socket.on("cl_ready", (id) => {
        io.to(id).emit("cl_ready", socket.id);
    })
    socket.on("rm_ready", (id) => {
        io.to(id).emit("rm_ready", socket.id);

    })
    socket.emit("id", socket.id);
    IDs[socket.id] = true;
    console.log({ IDs })
    console.log(`someone made connection ${socket.id}`)
});

io.listen(process.env.PRODUCTION ? process.env.PROD_WS_PORT : process.env.DEV_WS_PORT);
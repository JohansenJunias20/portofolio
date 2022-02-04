require('dotenv').config()
const { Server } = require("socket.io");
const fs = require('fs');

const production = process.env.PRODUCTION ? true : false;
const ssl = production ? process.env.PROD_WS_SSL == "TRUE" ? true : false : process.env.DEV_WS_SSL == "TRUE" ? true : false;
const domain = production ? process.env.PROD_WS_DOMAIN : process.env.DEV_WS_DOMAIN;
const express = require('express');
const app = express();
app.use(express.json())
const httpServer = ssl ? require("https").createServer({
    key: fs.readFileSync(`/etc/letsencrypt/archive/${domain}/privkey1.pem`),
    cert: fs.readFileSync(`/etc/letsencrypt/archive/${domain}/cert1.pem`)
}, app) :
    require("http").createServer(app)
    ;
app.post('/*', noteVisitor);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*"
    }
});

function noteVisitor(req, res) {
    console.log("someone made post request")
    const body = req.body;
    res.send({ "status": true });
    var visitor = []
    if (fs.existsSync("./visitors/visitor.json"))
        visitor = JSON.parse(fs.readFileSync('./visitors/visitor.json'))
    body.time = getDateNow();
    visitor.push(body)
    fs.writeFileSync('./visitors/visitor.json', JSON.stringify(visitor));

}
const IDs = [];
function getDateNow() {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date in YYYY-MM-DD format
    console.log(year + "-" + month + "-" + date);

    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}
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
// io.listen(process.env.PRODUCTION ? process.env.PROD_WS_PORT : process.env.DEV_WS_PORT, () => {
//     console.log("test")
// });
httpServer.listen(process.env.PRODUCTION ? process.env.PROD_WS_PORT : process.env.DEV_WS_PORT, () => {
    console.log("done, please use live server VSCode extension to serve public/index.html files");

})
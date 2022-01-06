const { Server } = require("socket.io");

const io = new Server({
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    socket.on("offer", (e) => {
        socket.broadcast.emit("offer", e);
        console.log(e);
    })
    socket.on("candidate", ({ candidate }) => {
        console.log({ candidate })
        socket.broadcast.emit("candidate", { candidate });
    })
    socket.on("join", () => {
        socket.broadcast.emit("join");
    })
    console.log(`someone made connection ${socket.id}`)
});
io.listen(2000)
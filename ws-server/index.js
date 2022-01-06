const { Server } = require("socket.io");

const io = new Server({
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    socket.on("offer", (e) => {
        const { id, sdp } = e;
        io.to(id).emit("offer", { id: socket.id, sdp }); //id unecessary
    })
    socket.on("answer", (e) => {
        const { id, sdp } = e;
        io.to(id).emit("answer", { id: socket.id, sdp }); //id unecessary
    })
    socket.on("candidate", ({ id, candidate }) => {
        console.log({ candidate })
        io.to(id).emit("candidate", { id: socket.id, candidate });
        // socket.broadcast.emit("candidate", { candidate });
    })
    socket.on("join", () => {
        socket.broadcast.emit("join", socket.id);
    })
    socket.on("disconnect", () => {
        socket.broadcast.emit("left", socket.id);
    })
    console.log(`someone made connection ${socket.id}`)
});
io.listen(2000)
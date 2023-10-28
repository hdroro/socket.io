const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:8081" });

io.on("connection", (socket) => {
  console.log("new connection: ", socket.id);

  socket.on("send-message", (data) => {
    socket.broadcast.emit("recieve-message", data);
  })
});

io.listen(3001);
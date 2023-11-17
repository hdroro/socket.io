const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:8080" });

let onlineUsers = []

io.on("connection", (socket) => {
  console.log("new connection: ", socket.id);

 
  socket.on("addNewUser", (userID) => {
    !onlineUsers.some((user) => user.userID === userID) &&
      onlineUsers.push({
        userID,
        socketID: socket.id,
      })
      console.log("onlineUsers", onlineUsers);

      io.emit("getOnlineUsers", onlineUsers);
  })

  socket.on("send-request-matching", (data) => {
    // console.log('hong diem cho dien');
    console.log('hoho', data);
    const user = onlineUsers.find(user => user.userID == data.matchId)
    // console.log(onlineUsers);
    // console.log('bicute');
    // console.log('hehe', user);
    // console.log('bi siu cuteeeeeeee');
    console.log(user);
    if(user){
      socket.to(user.socketID).emit("receive-request-matching", data);
    }
  })

  socket.on("accept-request-matching", (data) => {
    const user = onlineUsers.find(user => user.userID == data.fromId)
    console.log(user);
    if(user) {
      socket.to(user.socketID).emit("move-to-new-conversation", data);
    }
  })

  socket.on("send-message", (data) => {
    console.log(data._idSession);
    console.log(onlineUsers);
    const user = onlineUsers.find(user => user.userID == data._idSession)
    console.log(user);
    if(user){
      socket.to(user.socketID).emit("recieve-message", data);
    }
  })

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(user => user.socketID !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  })
});

io.listen(3001);
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

  socket.on('block-conversation', (data) =>{
    const user = onlineUsers.find(user => user.userID == data.idUser_)
    console.log("user " + user);
    if(user){
      console.log("hehe có block ko? " + data.value);
      socket.to(user.socketID).emit("blocked-conversation", data);
    }
  })

  socket.on('open-block-conversation', (data) =>{
    const user = onlineUsers.find(user => user.userID == data.idUser_)
    console.log("user " + user);
    if(user){
      console.log("hehe mở block ko? " + data.value);
      socket.to(user.socketID).emit("opened-block-conversation", data);

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
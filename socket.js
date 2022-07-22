const http = require("./app");
const socketIo = require("socket.io");
const Message = require("./server/schemas/message");

const io = socketIo(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const chatspace = io.of('/chat');
chatspace.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); //연결에 사용되는 소켓 정보

  socket.on("change_room", async (now, next) => {
    socket.leave(now);
    socket.join(next);
    const chat_list = await Message.find({ next });
    socket.emit("chat_list", chat_list);
  });

  socket.on("send_message", async (messageData) => {
    const messages = new Message(messageData);
    console.log("sendMessages: ", messages);
    await messages.save();

    //data: 방 이름, 쓴 사람, 메시지 내용, 작성 시간
    socket.to(messageData.room).emit("receive_message", messageData);
    console.log("방이름이 여기에", messageData.room);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});



// socket.on("join_room", async (room) => {
  //   socket.join(room);
  //   console.log("room: ", `${room}에 입장.`);

  //   const chat_list = await Message.find({ room });
  //   socket.emit("chat_list", chat_list);
  //   //data : 방 이름

  //   // socket.emit("welcome_msg", username, room);
  // });

// socket.on("leave_room", (room) => {
  //   console.log("room: ", `${room}을 떠남.`);
  //   socket.leave(room);
  // });
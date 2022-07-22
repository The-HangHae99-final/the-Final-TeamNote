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

  socket.on("join_room", async ( room ) => {
    socket.join(room);
    console.log("room: ", `${room}에 입장.`);
    const chat_list = await Message.find({ room });
    socket.emit("chat_list", chat_list);


  });

  socket.on("send_message", async (messageData) => {
    const messages = new Message(messageData);
    console.log("sendMessages: ", messages);
    await messages.save();

    socket.to(messageData.room).emit("receive_message", messageData);
  });
  socket.on("leave_room", (room, messageList) => {
    console.log("room: ", `${room}을 떠남.`);
    socket.leave(room);
  });

  socket.on("change_room", (now, next) => {
    socket.leave(now);
    socket.join(next);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

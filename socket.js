const http = require("./app");
const socketIo = require("socket.io");
const Message = require("./schemas/message")


const io = socketIo(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`); //연결에 사용되는 소켓 정보

  socket.on("join_room", async (username, room) => {
    socket.join(room);
    const chat_list = await Message.find();
    socket.emit("chat_list", chat_list);
    //data : 방 이름

    console.log(`User with ID: ${username} joined room: ${room}`);
    socket.emit("welcome_msg", username, room);
  });

  socket.on("send_message", (messageData) => {
    console.log("메시지: ", messageData);
    //data: 방 이름, 쓴 사람, 메시지 내용, 작성 시간
    socket.to(messageData.room).emit("receive_message", messageData);
  });
  //방 떠나면서 채팅내역 저장하게 할것임. (조회해보고 방 정보가 같으면 그쪽 데이터를 갱신해주는 방식으로 수정해야할듯.)
  socket.on("leave_room", (room, messageList) => {
    console.log("room: ", room);
    socket.leave(room);

    const message = new Message(messageList);
    for (let i = 0; i < messageList.length; i++) {
      message.msg.push(messageList[i]);
    }
    message.save();

    console.log(messageList);
  });

  socket.on("change_room", (now, next) => {
    socket.leave(now);
    socket.join(next);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

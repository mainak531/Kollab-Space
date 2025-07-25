const { verifyUserWithToken } = require('./utils/jwt');
const { randomStringGenerator } = require('./utils/random');

const chatRooms = new Map(); //{name:password}
const chatRoomsInviteCodes = new Map(); //{inviteCode : {name,password}}
const chatRoomsInviteSecrets = new Map(); // {{name,password} : inviteCode}

const generateNewRoom = () => {
  let roomName = randomStringGenerator();
  while (chatRooms.has(roomName)) {
    roomName = randomStringGenerator();
  }
  const roomPassword = randomStringGenerator();
  chatRooms.set(roomName, roomPassword);

  let roomInviteCode = randomStringGenerator(5, false);
  if (chatRoomsInviteCodes.has(roomInviteCode)) {
    roomInviteCode = randomStringGenerator(5, false);
  }
  chatRoomsInviteCodes.set(roomInviteCode, { roomName, roomPassword });
  chatRoomsInviteSecrets.set(
    JSON.stringify({ roomName, roomPassword }),
    roomInviteCode
  );
  return { roomName, roomPassword, roomInviteCode };
};

module.exports = function (server) {
  const io = require("socket.io")(server);

  io.on("connection", (socket) => {
    socket.on("newMessage", (data) => {
      console.log("message received");
      io.to(data.room.name).emit("messageReceived", data);
    });

    socket.on("createNewRoom", async (data) => {
      const user = data.user;
      const verified = await verifyUserWithToken(user.token, user.name);
      if (verified) {
        const newRoom = generateNewRoom();
        socket.emit("createdNewRoom", newRoom);
      } else {
        socket.emit("Invalid user");
      }
    });

    socket.on("joinChatRoom", async (data) => {
      const user = data.user;
      const verified = await verifyUserWithToken(user.token, user.name);

      if (!verified) {
        socket.emit("Invalid user");
        return;
      }

      const { roomName, roomPassword } = data.room;

      if (!chatRooms.has(roomName)) {
        socket.emit("Room does not exist");
        return;
      }

      const correctPassword = chatRooms.get(roomName);

      if (correctPassword !== roomPassword) {
        socket.emit("Incorrect room password");
        return;
      }

      socket.join(roomName);
      const { avatarInfo } = data;
      const inviteCode = chatRoomsInviteSecrets.get(
        JSON.stringify({
          roomName,
          roomPassword,
        })
      );

      io.to(roomName).emit("roomJoinNotification", {
        notification: "New Participant",
        room: { name: roomName, password: roomPassword, inviteCode },
        user,
        avatarInfo,
      });
    });

    socket.on("joinRoomViaInviteCode", async (data) => {
      const { user, inviteCode, avatarInfo } = data;
      const verified = await verifyUserWithToken(user.token, user.name);
      if (verified) {
        if (chatRoomsInviteCodes.has(inviteCode)) {
          const { roomName, roomPassword } =
            chatRoomsInviteCodes.get(inviteCode);
          socket.join(roomName);
          io.to(roomName).emit("roomJoinNotification", {
            notification: "New Participant",
            room: { name: roomName, password: roomPassword, inviteCode },
            user,
            avatarInfo,
          });
        } else {
          socket.emit("Invalid room invite code");
        }
      } else {
        socket.emit("Invalid user");
      }
    });

    socket.on("leaveChatRoom", (data) => {
      const { user, room, avatarInfo } = data;
      io.to(room.name).emit("roomJoinNotification", {
        notification: "Participant Left",
        user,
        avatarInfo,
        room,
      });
    });

    socket.on("codeChange", (data) => {
      if (data.room && data.room.name) {
        console.log("code change", data.user.name)
        socket.to(data.room.name).emit("codeUpdate", {
          code: data.code,
          cursorPosition: data.cursorPosition,
          user: data.user,
        });
      }
    });

    socket.on("cursorChange", (data) => {
      if (data.room && data.room.name)
        socket.to(data.room.name).emit("cursorPositionUpdate", {
          row: data.row,
          column: data.column,
        });
    });

    socket.on("languageChange", (data) => {
      if (data.room && data.room.name)
        io.to(data.room.name).emit("languageTagUpdate", {
          lang: data.lang,
        });
    });
  });
};

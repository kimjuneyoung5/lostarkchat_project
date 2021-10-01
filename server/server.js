const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 8000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// require files
// routes
require("./routes/routes")(app);
// mongoose
require("./config/mongoose.config");

// start the server
const server = app.listen(8000, () =>
  console.log('The server is all fired up on port 8000')
);
//app.listen(PORT, () => console.log(`>> server started on port ${PORT} <<`));

const sockets = require("socket.io");
const io = sockets(server, { cors: true });

var userObjects = [];
var messageObjects = [];

const getTimestamp = () => {
    var date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    return `${hour}:${min}:${sec}`;
  };

io.on("connection", (socket) => {

    console.log(socket.id);

    socket.on("join_room", ({roomName, username}) => {
        const user = {
            id: socket.id,
            username: username,
            roomName: roomName
        };
        console.log("user", user);

        userObjects.push(user);

        socket.join(user.roomName);
        console.log(`${user.username} joined room:`, user.roomName);

        socket.broadcast.to(user.roomName).emit("message_from_server", {
            message: `${user.username} has joined the chatroom`,
            date: getTimestamp()
        });

        if(messageObjects.filter((s) => s.roomName === roomName)){
            const findThatRoomsMsgs = (roomName) => messageObjects.filter((s) => s.roomName === roomName);

            const giveNewUserRoomMessage = findThatRoomsMsgs(user.roomName);

            io.to(user.roomName).emit("server says - heres your data ", giveNewUserRoomMessage);
        }

        const getRoomUsers = (roomName) => userObjects.filter((user) => user.roomName === roomName);
        io.to(user.roomName).emit("usersInRoom", {
            roomName: user.roomName,
            users: getRoomUsers(user.roomName)
        });
    });

    socket.on("event-from-client", ({roomName, content: {username, message}}) => {
        messageObjects.push({
            roomName: roomName,
            username: username,
            message: message,
            client_id: socket.id,
            date: getTimestamp()
        });

        let newMessageToSendToClient = {
            username: username,
            message: message,
            client_id: socket.id,
            date: getTimestamp()
        };

        io.to(roomName).emit("receive_message", newMessageToSendToClient);
    });

    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED", socket.id);

        const leftUser = (id) => {
            const index = userObjects.findIndex((user) => user.id === id);

            if(index !== -1){
                return userObjects.splice(index, 1)[0];
            }
        };

        const user = leftUser(socket.id);
        if(user) {
            io.to(user.roomName).emit("disconnected_user", {user: user.username, date:getTimestamp() });

            const getRoomUsers = (roomName) => userObjects.filter((user) => user.roomName === roomName);
            io.to(user.roomName).emit("usersInRoom", {
                roomName: user.roomName,
                users: getRoomUsers(user.roomName)
            });

        }
    });
});
const socketIo = require("socket.io");

const activeConnections = [];
function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: ["http://localhost:3001"],
    },
  });
  io.on("connection", (socket) => {
    const connectionId = socket.id;
    activeConnections.push(connectionId);
    socket.on("new_connection", (userId) => {
      socket.join(userId);
    });
    // socket.on("connect_event", (eventId) => {
    //   activeUsers.push(eventId);
    // });
    socket.on("new_order", (order) => {
      socket.to(order.notifyTo).emit("new_order", order);
      console.log(order);
    });
    socket.on("new_comment", (comment) => {
      socket.broadcast.to(comment.notifyTo).emit("new_comment", comment);
    });
    socket.on("new_comment2", (comment) => {
      activeConnections.forEach((connectionId) => {
        console.log(connectionId);
        io.to(connectionId).emit("send_comment_all", comment);
      });
    });
    socket.on("reply_comment", (comment) => {
      socket.to(comment.notifyTo).emit("reply_comment", comment);
    });
    socket.on("logout", (userId) => {
      socket.leave(userId);
    });
  });
}
module.exports = initializeSocket;

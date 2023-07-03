const socketIo = require("socket.io");
function initializeSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: ["http://localhost:3001"],
    },
  });
  io.on("connection", (socket) => {
    socket.on("new_connection", (userId) => {
      console.log(userId);
      socket.join(userId);
    });
    socket.on("new_order", (order) => {
      socket.to(order.notifyTo).emit("new_order", order);
      console.log(order);
    });
    socket.on("new_comment", (comment) => {
      socket.to(comment.creatorId).emit("new_comment", comment);
    });
    socket.on("reply_comment", (comment) => {
      socket.to(comment.creator).emit("reply_comment", comment);
    });
  });
}
module.exports = initializeSocket;

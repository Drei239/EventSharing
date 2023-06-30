const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(); // Tạo máy chủ HTTP

const io = new Server(server, {
  cors: { origin: ["http://localhost:3001"] },
});

io.on("connection", (socket) => {
  socket.on("new_connection", (userId) => {
    console.log(userId);
    socket.join(userId);
  });
  socket.on("new_order", (order) => {
    socket.to(order.creatorId).emit("new_order", order);
    console.log(order);
  });
});
server.listen(3003, () => {
  console.log("Server is running on port 3003");
});

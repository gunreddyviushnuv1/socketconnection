const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  socket.on("subscribe", (topic) => {
    console.log(`${socket.id} subscribed to ${topic}`);
    socket.join(topic);
  });

  socket.on("publish", () => {
    console.log("Unauthorized publish attempt by:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// API Server writes messages via this endpoint
app.use(express.json());
app.post("/publish", (req, res) => {
  const { topic, message, key } = req.body;
  if (!topic || !message || !key) {
    return res.status(400).json({ error: "Topic and message are required" });
  }

  if (key == "78123ksdkjhd79237293kshdlhd89236923klhkklh28938fj") {
    io.to(topic).emit("message", message); // Send message to all listeners
    console.log(`Message sent to topic ${topic}:`, message);
    res.json({ success: true, topic, message });
  } else {
    res.json({ success: false });
  }
});

const PORT = 3000;
server.listen(PORT, () =>
  console.log(`Socket.io server running on port ${PORT}`)
);

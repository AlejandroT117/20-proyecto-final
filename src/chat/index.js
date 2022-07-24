const logger = require("../log");
const messageModel = require("../models/message.model");

const users = {};

module.exports = (socket) => {
  logger.log(`New socket connection ${socket.id}`);

  socket.on("start", async (email) => {
    users[socket.id] = email;
    let messages = []

    try{
      messages = await messageModel.getAll();
    }catch(e){
      logger.error(e)
    }
    console.log(messages)

    socket.emit("messages", messages);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete users[socket.id];
    socket.broadcast.emit("offline", socket.id);
  });

  /* Responde a la adición de un nuevo mensaje */
  socket.on("new_message", (message) => {
    mensajes.save({ ...message });
    socket.emit("mensaje", {
      email: message.author.email,
      avatar: message.author.avatar,
      fecha: message.fecha,
      mensaje: message.mensaje,
    });
    socket.broadcast.emit("mensaje", { ...message });
  });
};

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
    logger.log(messages)

    socket.emit("messages", messages);
  });

  socket.on("disconnect", () => {
    logger.log("user disconnected");
    delete users[socket.id];
    socket.broadcast.emit("offline", socket.id);
  });

  /* Responde a la adición de un nuevo mensaje */
  socket.on("new_message", (message) => {
    logger.log(message)
    
    messageModel.save(message);

    socket.emit("message", message);

    socket.broadcast.emit("message", message);
  });
};

function cookieParser() {
  return (document.cookie || "").split("; ").reduce((obj, cookie) => {
    const [name, value] = cookie.split("=");
    obj[name] = decodeURI(value);
    return obj;
  }, {});
}

const { firstname, lastname, email, id } = cookieParser();
const user = { firstname, lastname, email, id };
user.socket = io();

user.socket.on("connect", () => {
  console.log(`Connection ${user.socket.id}`);
  user.socket.emit("start", user.email);
});

user.socket.on("messages", renderMessages);

function renderMessages(messages) {
  for (const message of messages) {
    const { user, mensaje, fecha } = message;
    renderMessage(mensaje, user, fecha);
  }
}

function renderMessage(content, user, date) {
  const messageDiv = document.createElement("div");
  messageDiv.className("message-chat");
  const userDiv = document.createElement("div");
  userDiv.className("user");
  const textDiv = document.createElement("div");
  textDiv.className("text");
  const dateDiv = document.createElement("div");
  dateDiv.className("date");

  userDiv.innerHTML = user;
  textDiv.innerHTML = content;
  dateDiv.innerHTML = date;

  messageDiv
    .appendChild(userDiv)
    .appendChild(textDiv).appendChild(dateDiv);
}

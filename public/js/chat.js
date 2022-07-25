const chatContainer = document.querySelector(".chat-container");
const messageContainer = document.querySelector(".message-container");
const formChat = document.getElementById("form-chat");
const inputChat = document.getElementById("messsageInput");
const toogleChat = document.querySelector(".toggle");

toogleChat.addEventListener("click", () => {
  console.log(chatContainer.className);
  if (!chatContainer.className.match(/expanded/g)) {
    chatContainer.classList.add("expanded");
  } else {
    chatContainer.classList.remove("expanded");
  }
});

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

user.socket.on("message", (message) => {
  const { user, mensaje, fecha } = message;
  renderMessage(mensaje, user, fecha);
});

function renderMessage(content, userMsg, date) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message-chat");
  const userDiv = document.createElement("div");
  userDiv.classList.add("user");
  const textDiv = document.createElement("div");
  textDiv.classList.add("text");

  const dateDiv = document.createElement("div");
  dateDiv.classList.add("date");

  if (user.email === userMsg) {
    userDiv.classList.add("own");
  } else {
    userDiv.classList.add("received");
  }

  userDiv.innerHTML = userMsg;
  textDiv.innerHTML = content;

  if (date) {
    dateDiv.innerHTML = date;
  }

  messageDiv.appendChild(userDiv).appendChild(textDiv).appendChild(dateDiv);

  messageContainer.appendChild(messageDiv);
}

formChat.addEventListener("submit", (e) => {
  e.preventDefault();
  const mensaje = inputChat.value;
  const fecha = new Date().toLocaleDateString();

  user.socket.emit("new_message", { user: user.email || 'Anónimo', mensaje, fecha });
  inputChat.value = "";
});

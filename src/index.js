const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8080;

const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv");
  dotenv.config({
    path: path.resolve(__dirname, "../local.env"),
  });
}

//passport
const passport = require("passport");
const flash = require("express-flash");
const initializePassport = require("./passport/local");

const pugEngine = require("./engine");
const logger = require("./log");

const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS } =
  require("./config").mongoConfig;

const homeRouter = require("./routes/home.routes");
const loginRouter = require("./routes/login.routes");
const configRouter = require("./routes/config.routes");

const prodsRouter = require("./routes/products.routes");
const carritoRouter = require("./routes/cart.routes");

const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? `${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`
    : "mongodb://localhost:27017/ecommerce";

const graphql = require("./graphql");

//socket io -chat
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server);
const chat = require("./chat");

/* Mongo */
(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.log("Corriendo mongo");

    app.use(cors());
    pugEngine(app);
    /* express */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/static", express.static(path.join(__dirname, "../public")));
    app.use(cookieParser("secret"));
    app.use(
      session({
        store: MongoStore.create({
          mongoUrl: MONGO_URI,
          ttl: 20 * 60, //10 minutos para expiración
          autoRemove: "native",
        }),

        secret: "secreto",
        resave: true,
        saveUninitialized: true,
      })
    );

    //passport initialize
    initializePassport(passport);
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    //routes
    graphql(app);
    app.use("/", homeRouter);
    app.use("/", loginRouter);
    app.use("/config", configRouter);

    //APIs
    app.use("/api/productos", prodsRouter);
    app.use("/api/carrito", carritoRouter);

    //chat
    io.on("connection", chat);

    app.use((err, req, res, next) => {
      logger.log(err.stack);
      res.status(500).send({ error: err });
      next(err);
    });

    app.get("*", function (req, res) {
      res
        .status(400)
        .send({ status: 404, title: "Not Found", msg: "Route not found" });
    });
  } catch (e) {
    logger.error(`Error en mongo: ${err}`);
  }
})();

module.exports = server;

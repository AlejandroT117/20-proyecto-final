const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8080;

const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo')

//passport
const passport = require('passport')
const flash = require('express-flash')
//const initializePassport = require('./passport/local')

const pugEngine = require('./engine')
const logger = require('./log')

const { HOSTNAME, SCHEMA, DATABASE, USER, PASSWORD, OPTIONS  } = require("./config");

const prodsRouter = require("./routes/productos");
const homeRouter = require("./routes/home");
const carritoRouter = require("./routes/carrito");

const MONGO_URI = `${SCHEMA}://${USER}:${PASSWORD}@${HOSTNAME}/${DATABASE}?${OPTIONS}`;

/* Mongo */
(async()=>{
  try{
    await mongoose.connect(MONGO_URI)
    logger.log("Corriendo mongo");
  
  
    app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
        return res.status(200).json({});
      }
      next();
    });
 
    pugEngine(app) 
    /* express */
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use("/static", express.static(path.join(__dirname, "/public")));
    app.use(cookieParser('secret'))
    app.use(
      session({
        store: MongoStore.create({
          mongoUrl:MONGO_URI,
          ttl: 10*60, //10 minutos para expiración
          autoRemove: "native"
        }),

        secret:'secreto',
        resave:true,
        saveUninitialized:true
      })
    )

    //passport initialize
    //initializePassport(passport)
    app.use(flash())
    app.use(passport.initialize())
    app.use(passport.session())

    //routes
    app.use("/", homeRouter);

    //APIs
    app.use("/api/productos", prodsRouter);
    app.use("/api/carrito", carritoRouter);
  
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
    app.listen(PORT, () =>
      logger.log(`Escuchando en: http://localhost:${PORT}`)
    );
  } catch(e){
    logger.error(`Error en mongo: ${err}`);
  }
})()
